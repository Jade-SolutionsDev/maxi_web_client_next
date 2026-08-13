import { ApiError, SessionRequiredError } from '@/api/error';
import type { OrderFailure } from '../type/order.type';

interface ConflictDetail {
  message?: unknown;
  available?: unknown;
}

interface ErrorBody {
  error?: { message?: unknown; details?: ConflictDetail[] };
}

const readStaleLines = (
  body: unknown,
): { name: string; available: number }[] => {
  const details = (body as ErrorBody | null)?.error?.details;

  if (!Array.isArray(details)) return [];

  return details
    .filter((detail) => typeof detail.available === 'number')
    .map((detail) => ({
      name: extractName(detail.message),
      available: detail.available as number,
    }));
};

const extractName = (message: unknown): string => {
  if (typeof message !== 'string') return 'Producto';

  const quoted = message.match(/"([^"]+)"/);

  return quoted?.[1] ?? 'Producto';
};

const readMessage = (body: unknown): string =>
  typeof (body as ErrorBody | null)?.error?.message === 'string'
    ? ((body as ErrorBody).error?.message as string)
    : '';

export const toOrderFailure = (error: unknown): OrderFailure => {
  if (error instanceof SessionRequiredError) return { kind: 'unauthenticated' };

  if (!(error instanceof ApiError)) return { kind: 'unknown' };

  if (error.status === 401) return { kind: 'unauthenticated' };
  if (error.status === 404) {
    return readMessage(error.body).includes('payment attempt')
      ? { kind: 'no-payment' }
      : { kind: 'not-found' };
  }

  if (error.status === 400) {
    const message = readMessage(error.body);

    if (message.includes('already paid')) return { kind: 'already-paid' };
    if (message.includes('Cart is empty')) return { kind: 'empty-cart' };

    return { kind: 'unknown' };
  }

  if (error.status === 409) {
    const lines = readStaleLines(error.body);

    return lines.length > 0
      ? { kind: 'stale-cart', lines }
      : { kind: 'payment-conflict' };
  }

  if (error.status === 408 || error.status === 502 || error.status === 0) {
    return { kind: 'gateway-unavailable' };
  }

  if (error.status >= 500) return { kind: 'gateway-unavailable' };

  return { kind: 'unknown' };
};
