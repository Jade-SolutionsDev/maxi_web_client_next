import 'server-only';

import { ApiError, SessionRequiredError } from './error';
import { getSessionToken } from './session';

export { ApiError, SessionRequiredError } from './error';

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error('Missing API_URL environment variable');
}

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const API_BASE = trimTrailingSlash(BASE_URL);

export type ApiResponse<T> = {
  data: T;
};

// List endpoints wrap the collection in a pagination envelope instead of
// returning the array directly: { data: { items, total, page, limit, totalPages } }.
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number | null;
  totalPages: number;
};

export type ApiOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  next?: NextFetchRequestConfig;
};

const isAbsolute = (path: string) => /^https?:\/\//.test(path);

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, body, headers, ...init } = options;
  // An absolute URL escapes API_BASE: some resources live on a different host.
  const url = new URL(
    isAbsolute(path) ? path : `${API_BASE}/${path.replace(/^\/+/, '')}`,
  );
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    // AbortSignal.timeout rejects with a native DOMException whose `message` is
    // getter-only. Letting it escape crashes Next's server error normalization
    // ("Cannot set property message of ... which has only a getter"). Re-wrap it
    // in an ApiError with a writable message; re-throw anything else untouched.
    if (
      err instanceof DOMException &&
      (err.name === 'TimeoutError' || err.name === 'AbortError')
    ) {
      const timeoutError = new ApiError(
        408,
        `${init.method ?? 'GET'} ${path} → request timed out`,
      );
      timeoutError.cause = err;
      throw timeoutError;
    }
    throw err;
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      `${init.method ?? 'GET'} ${path} → ${res.status}`,
      errorBody,
    );
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

/**
 * `api()` para endpoints atados a la cuenta (carrito, órdenes, direcciones…):
 * envía el token de Clerk del cliente autenticado.
 *
 * Separado de `api()` a propósito. Resolver el token lee headers del request, y
 * eso es ilegal dentro de un scope `'use cache'`: mantenerlo fuera de `api()` es
 * lo que permite que servicios públicos cacheados como `getCategories()` sigan
 * funcionando.
 *
 * Lanza `SessionRequiredError` antes de cualquier fetch si no hay sesión, y
 * fuerza `no-store`: la respuesta es de un cliente puntual y cachearla se la
 * entregaría al siguiente.
 */
export async function apiAuth<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const token = await getSessionToken();

  if (!token) throw new SessionRequiredError();

  return api<T>(path, {
    ...options,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
