import { describe, expect, it } from 'vitest';
import { ApiError, SessionRequiredError } from '@/api/error';
import { toCartFailure } from './cart-error';

const conflict = (details: unknown) =>
  new ApiError(409, 'POST /cart/items → 409', {
    error: {
      code: 'ConflictException',
      message: 'Insufficient stock: only 5 available',
      details,
    },
  });

describe('toCartFailure', () => {
  it('reads the available count from details instead of the message', () => {
    const failure = toCartFailure(
      conflict([
        { field: 'quantity', message: 'Only 5 available', available: 5 },
      ]),
    );

    expect(failure).toEqual({ kind: 'insufficient-stock', available: 5 });
  });

  it('accepts a sold out line reported as zero available', () => {
    const failure = toCartFailure(conflict([{ available: 0 }]));

    expect(failure).toEqual({ kind: 'insufficient-stock', available: 0 });
  });

  it('falls back to unknown when the 409 carries no usable details', () => {
    expect(toCartFailure(conflict([]))).toEqual({ kind: 'unknown' });
    expect(toCartFailure(conflict(undefined))).toEqual({ kind: 'unknown' });
    expect(toCartFailure(conflict([{ field: 'quantity' }]))).toEqual({
      kind: 'unknown',
    });
  });

  it('maps a missing product or line to not-found', () => {
    expect(toCartFailure(new ApiError(404, 'not found'))).toEqual({
      kind: 'not-found',
    });
  });

  it('maps both flavours of missing session to unauthenticated', () => {
    expect(toCartFailure(new ApiError(401, 'Client not registered'))).toEqual({
      kind: 'unauthenticated',
    });
    expect(toCartFailure(new SessionRequiredError())).toEqual({
      kind: 'unauthenticated',
    });
  });

  it('does not mistake the request timeout for a cart problem', () => {
    expect(toCartFailure(new ApiError(408, 'timed out'))).toEqual({
      kind: 'unknown',
    });
  });

  it('survives anything that is not an ApiError', () => {
    expect(toCartFailure(new TypeError('fetch failed'))).toEqual({
      kind: 'unknown',
    });
  });
});
