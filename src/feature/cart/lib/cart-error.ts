import { ApiError, SessionRequiredError } from '@/api/error';
import type { CartFailure } from '../type/cart.interface';

interface ConflictDetail {
  available?: unknown;
}

interface ConflictBody {
  error?: { details?: ConflictDetail[] };
}

const readAvailable = (body: unknown): number | null => {
  const detail = (body as ConflictBody | null)?.error?.details?.[0];

  return typeof detail?.available === 'number' ? detail.available : null;
};

export const toCartFailure = (error: unknown): CartFailure => {
  if (error instanceof SessionRequiredError) return { kind: 'unauthenticated' };

  if (!(error instanceof ApiError)) return { kind: 'unknown' };

  if (error.status === 401) return { kind: 'unauthenticated' };
  if (error.status === 404) return { kind: 'not-found' };

  if (error.status === 409) {
    const available = readAvailable(error.body);

    if (available !== null) return { kind: 'insufficient-stock', available };
  }

  if (
    error.status === 408 ||
    error.status === 502 ||
    error.status === 0 ||
    error.status >= 500
  ) {
    return { kind: 'gateway-unavailable' };
  }

  return { kind: 'unknown' };
};
