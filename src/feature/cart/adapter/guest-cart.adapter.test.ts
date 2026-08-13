import { describe, expect, it } from 'vitest';
import type { Product } from '@/feature/product/type/product.interface';
import type { GuestLine } from '../type/cart.interface';
import { toGuestCart, toGuestLine } from './guest-cart.adapter';

const product: Product = {
  id: '0a4e',
  slug: 'cola-1l',
  name: '  Cola 1L  ',
  price: 7.5,
  measureUnit: 'unidad',
  format: 'Botella 1 L',
  discount: 20,
  image: 'https://cdn.test/cola.webp',
  available: 5,
};

const line: GuestLine = {
  productId: '0a4e',
  slug: 'cola-1l',
  name: 'Cola 1L',
  measureUnit: 'unidad',
  quantity: 3,
  unitPrice: 7.5,
  available: 5,
};

describe('toGuestLine', () => {
  it('snapshots the catalog price so the row renders without a refetch', () => {
    expect(toGuestLine(product, 2)).toEqual({
      productId: '0a4e',
      slug: 'cola-1l',
      name: 'Cola 1L',
      measureUnit: 'unidad',
      format: 'Botella 1 L',
      image: 'https://cdn.test/cola.webp',
      quantity: 2,
      unitPrice: 7.5,
      available: 5,
      discount: 20,
    });
  });

  it('drops a zero discount so no badge claims a saving of nothing', () => {
    expect(
      toGuestLine({ ...product, discount: 0 }, 1).discount,
    ).toBeUndefined();
  });
});

describe('toGuestCart', () => {
  it('adds up the lines, since no server is doing it in guest mode', () => {
    const cart = toGuestCart([line, { ...line, productId: 'b2', quantity: 1 }]);

    expect(cart.totalItems).toBe(4);
    expect(cart.subtotal).toBe(30);
    expect(cart.lines[0].lineTotal).toBe(22.5);
  });

  it('rounds money instead of leaking float noise into the total', () => {
    const cart = toGuestCart([{ ...line, unitPrice: 0.1, quantity: 3 }]);

    expect(cart.subtotal).toBe(0.3);
  });

  it('flags a line whose quantity outgrew the stock it was added against', () => {
    const cart = toGuestCart([{ ...line, quantity: 9, available: 5 }]);

    expect(cart.lines[0].isAvailable).toBe(false);
  });

  it('treats a line within stock as available', () => {
    expect(toGuestCart([line]).lines[0].isAvailable).toBe(true);
  });
});
