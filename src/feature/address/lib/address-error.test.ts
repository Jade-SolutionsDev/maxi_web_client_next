import { describe, expect, it } from 'vitest';
import { ApiError, SessionRequiredError } from '@/api/error';
import { toAddressFailure } from './address-error';

describe('toAddressFailure', () => {
  it('maps a missing session', () => {
    expect(toAddressFailure(new SessionRequiredError())).toEqual({
      kind: 'unauthenticated',
    });
  });

  it('maps 401 and 404', () => {
    expect(toAddressFailure(new ApiError(401, 'nope'))).toEqual({
      kind: 'unauthenticated',
    });
    expect(toAddressFailure(new ApiError(404, 'nope'))).toEqual({
      kind: 'not-found',
    });
  });

  it('maps the address cap to its own failure', () => {
    expect(toAddressFailure(new ApiError(409, 'too many'))).toEqual({
      kind: 'limit-reached',
    });
  });

  it('maps a rejected body to invalid', () => {
    expect(toAddressFailure(new ApiError(400, 'bad'))).toEqual({
      kind: 'invalid',
    });
    expect(toAddressFailure(new ApiError(422, 'bad'))).toEqual({
      kind: 'invalid',
    });
  });

  it('falls back to unknown', () => {
    expect(toAddressFailure(new Error('boom'))).toEqual({ kind: 'unknown' });
    expect(toAddressFailure(new ApiError(500, 'boom'))).toEqual({
      kind: 'unknown',
    });
  });
});
