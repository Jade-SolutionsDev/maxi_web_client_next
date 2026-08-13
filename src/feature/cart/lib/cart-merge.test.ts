import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/error';
import { type Cart, EMPTY_CART, type GuestLine } from '../type/cart.interface';
import { mergeGuestLines } from './cart-merge';

const line = (name: string, quantity: number): GuestLine => ({
  productId: name,
  slug: name,
  name,
  measureUnit: 'unidad',
  quantity,
  unitPrice: 10,
  available: 99,
});

const cartWith = (totalItems: number): Cart => ({ ...EMPTY_CART, totalItems });

const outOfStock = (available: number) =>
  new ApiError(409, 'conflict', {
    error: { details: [{ available }] },
  });

const ops = (
  overrides: Partial<Parameters<typeof mergeGuestLines>[1]> = {},
) => ({
  add: vi.fn(async () => cartWith(1)),
  setQuantity: vi.fn(async () => cartWith(1)),
  getCart: vi.fn(async () => EMPTY_CART),
  ...overrides,
});

describe('mergeGuestLines', () => {
  it('posts every stored line so the merge is additive', async () => {
    const operations = ops();

    await mergeGuestLines([line('cola', 2), line('pan', 1)], operations);

    expect(operations.add).toHaveBeenCalledWith('cola', 2);
    expect(operations.add).toHaveBeenCalledWith('pan', 1);
  });

  it('returns the cart from the last mutation without a follow-up GET', async () => {
    const operations = ops({ add: vi.fn(async () => cartWith(7)) });

    const result = await mergeGuestLines([line('cola', 2)], operations);

    expect(result.cart).toEqual(cartWith(7));
    expect(operations.getCart).not.toHaveBeenCalled();
  });

  it('falls back to a PATCH at the available quantity on a 409', async () => {
    const operations = ops({
      add: vi.fn(async () => {
        throw outOfStock(5);
      }),
    });

    const result = await mergeGuestLines([line('cola', 9)], operations);

    expect(operations.setQuantity).toHaveBeenCalledWith('cola', 5);
    expect(result.report?.clamped).toEqual([
      { name: 'cola', requested: 9, granted: 5 },
    ]);
    expect(result.report?.dropped).toEqual([]);
  });

  it('drops the line instead of patching to zero when nothing is left', async () => {
    const operations = ops({
      add: vi.fn(async () => {
        throw outOfStock(0);
      }),
    });

    const result = await mergeGuestLines([line('cola', 2)], operations);

    expect(operations.setQuantity).not.toHaveBeenCalled();
    expect(result.report?.dropped).toEqual([{ name: 'cola' }]);
  });

  it('drops the line when the clamped PATCH also fails', async () => {
    const operations = ops({
      add: vi.fn(async () => {
        throw outOfStock(5);
      }),
      setQuantity: vi.fn(async () => {
        throw outOfStock(0);
      }),
    });

    const result = await mergeGuestLines([line('cola', 9)], operations);

    expect(result.report?.clamped).toEqual([]);
    expect(result.report?.dropped).toEqual([{ name: 'cola' }]);
  });

  it('drops a product the catalog no longer has and keeps merging the rest', async () => {
    const operations = ops({
      add: vi.fn(async (productId: string) => {
        if (productId === 'cola') throw new ApiError(404, 'not found');
        return cartWith(3);
      }),
    });

    const result = await mergeGuestLines(
      [line('cola', 1), line('pan', 1)],
      operations,
    );

    expect(result.report?.dropped).toEqual([{ name: 'cola' }]);
    expect(result.cart).toEqual(cartWith(3));
  });

  it('reads the server cart when every line was rejected', async () => {
    const operations = ops({
      add: vi.fn(async () => {
        throw new ApiError(404, 'not found');
      }),
      getCart: vi.fn(async () => cartWith(4)),
    });

    const result = await mergeGuestLines([line('cola', 1)], operations);

    expect(operations.getCart).toHaveBeenCalledOnce();
    expect(result.cart).toEqual(cartWith(4));
  });

  it('aborts the whole merge when the session is gone', async () => {
    const operations = ops({
      add: vi.fn(async () => {
        throw new ApiError(401, 'unauthorized');
      }),
    });

    const result = await mergeGuestLines(
      [line('cola', 1), line('pan', 1)],
      operations,
    );

    expect(result.failure).toEqual({ kind: 'unauthenticated' });
    expect(operations.add).toHaveBeenCalledOnce();
  });

  it('reads the server cart when there is nothing stored to merge', async () => {
    const operations = ops({ getCart: vi.fn(async () => cartWith(2)) });

    const result = await mergeGuestLines([], operations);

    expect(operations.add).not.toHaveBeenCalled();
    expect(result.cart).toEqual(cartWith(2));
  });
});
