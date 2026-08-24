import { ApiError, SessionRequiredError } from '@/api/error';
import type { AddressFailure } from '../type/address.interface';

export const toAddressFailure = (error: unknown): AddressFailure => {
  if (error instanceof SessionRequiredError) return { kind: 'unauthenticated' };

  if (!(error instanceof ApiError)) return { kind: 'unknown' };

  if (error.status === 401) return { kind: 'unauthenticated' };
  // 404 is also what a municipality outside the catalog answers, but the form
  // only ever offers catalog municipalities, so in practice it means the
  // address is gone — deleted from another tab, most likely.
  if (error.status === 404) return { kind: 'not-found' };
  // The only 409 this endpoint raises is the per-customer address cap.
  if (error.status === 409) return { kind: 'limit-reached' };
  if (error.status === 400 || error.status === 422) return { kind: 'invalid' };

  return { kind: 'unknown' };
};
