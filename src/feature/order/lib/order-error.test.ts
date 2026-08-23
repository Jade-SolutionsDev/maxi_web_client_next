import { describe, expect, it } from 'vitest';
import { ApiError, SessionRequiredError } from '@/api/error';
import { toOrderFailure } from './order-error';

describe('toOrderFailure', () => {
  it('maps a missing session to unauthenticated', () => {
    expect(toOrderFailure(new SessionRequiredError())).toEqual({
      kind: 'unauthenticated',
    });
  });

  it('maps a stale-cart 409 with its offending lines', () => {
    const error = new ApiError(409, 'conflict', {
      error: {
        message: 'Some cart items are no longer available',
        details: [
          { field: 'p1', message: '"Cola 1L": only 2 available', available: 2 },
          { field: 'p2', message: '"Harina": only 0 available', available: 0 },
        ],
      },
    });

    expect(toOrderFailure(error)).toEqual({
      kind: 'stale-cart',
      lines: [
        { name: 'Cola 1L', available: 2 },
        { name: 'Harina', available: 0 },
      ],
    });
  });

  it('maps a 409 without stock details to payment-conflict', () => {
    const error = new ApiError(409, 'conflict', {
      error: { message: 'Only pending orders can be cancelled' },
    });

    expect(toOrderFailure(error)).toEqual({ kind: 'payment-conflict' });
  });

  it('maps already-paid and empty-cart 400s', () => {
    expect(
      toOrderFailure(
        new ApiError(400, 'bad', {
          error: { message: 'Order is already paid' },
        }),
      ),
    ).toEqual({ kind: 'already-paid' });
    expect(
      toOrderFailure(
        new ApiError(400, 'bad', { error: { message: 'Cart is empty' } }),
      ),
    ).toEqual({ kind: 'empty-cart' });
  });

  it('maps a no-payment 404 apart from a missing order', () => {
    expect(
      toOrderFailure(
        new ApiError(404, 'nf', {
          error: { message: 'This order has no payment attempt yet' },
        }),
      ),
    ).toEqual({ kind: 'no-payment' });
    expect(
      toOrderFailure(
        new ApiError(404, 'nf', { error: { message: 'Order not found' } }),
      ),
    ).toEqual({ kind: 'not-found' });
  });

  it('maps timeouts and 5xx to gateway-unavailable', () => {
    expect(toOrderFailure(new ApiError(408, 'timeout'))).toEqual({
      kind: 'gateway-unavailable',
    });
    expect(toOrderFailure(new ApiError(502, 'bad gateway'))).toEqual({
      kind: 'gateway-unavailable',
    });
  });

  it('falls back to unknown for anything else', () => {
    expect(toOrderFailure(new Error('boom'))).toEqual({ kind: 'unknown' });
  });
});
