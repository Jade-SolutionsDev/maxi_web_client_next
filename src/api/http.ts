import 'server-only';
const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error('Missing API_URL environment variable');
}

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const API_BASE = trimTrailingSlash(BASE_URL);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiResponse<T> = {
  data: T;
};

type ApiOptions = Omit<RequestInit, 'body'> & {
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
        Authorization: `Bearer ${process.env.API_TOKEN}`,
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
