
import 'server-only'
const BASE_URL = process.env.API_URL

if (!BASE_URL) {
  throw new Error('Missing API_URL environment variable')
}

const API_BASE = BASE_URL.replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}


export type ApiResponse<T> = {
  data: T
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
  next?: NextFetchRequestConfig
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { params, body, headers, ...init } = options
  const url = new URL(`${API_BASE}/${path.replace(/^\/+/, '')}`)
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v))
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
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new ApiError(res.status, `${init.method ?? 'GET'} ${path} → ${res.status}`, errorBody)
  }

  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}