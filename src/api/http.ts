import 'server-only';
const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error('Missing API_URL environment variable');
}

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const API_BASE = trimTrailingSlash(BASE_URL);

// Callers can opt into the legacy host ('old'); 'default' uses API_URL.
type ApiBase = 'default' | 'old';

const resolveBase = (base: ApiBase): string => {
  if (base === 'old') {
    const oldUrl = process.env.MAXI_OLD_API_URL;
    if (!oldUrl) {
      throw new Error('Missing MAXI_OLD_API_URL environment variable');
    }
    return trimTrailingSlash(oldUrl);
  }
  return API_BASE;
};

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
  base?: ApiBase;
};

const isAbsolute = (path: string) => /^https?:\/\//.test(path);

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, body, headers, base = 'default', ...init } = options;
  const apiBase = resolveBase(base);
  // An absolute URL escapes apiBase: some resources live on a different host.
  const url = new URL(
    isAbsolute(path) ? path : `${apiBase}/${path.replace(/^\/+/, '')}`,
  );
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });

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
