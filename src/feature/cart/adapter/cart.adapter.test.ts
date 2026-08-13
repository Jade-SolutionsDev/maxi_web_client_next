import { describe, expect, it } from 'vitest';
import type { CartResponse } from '../type/cart.interface';
import { toCart } from './cart.adapter';

const response: CartResponse = {
  items: [
    {
      productId: '0a4e',
      name: '  Cola 1L  ',
      slug: 'cola-1l',
      imageUrl: 'https://cdn.test/cola.webp',
      format: 'Botella 1 L',
      measureUnit: 'unidad',
      quantity: 3,
      unitPrice: 7.5,
      lineTotal: 22.5,
      available: 5,
      isAvailable: true,
    },
  ],
  totalItems: 3,
  subtotal: 22.5,
};

describe('toCart', () => {
  it('copies the server totals instead of recomputing them', () => {
    const cart = toCart({ ...response, totalItems: 99, subtotal: 1 });

    expect(cart.totalItems).toBe(99);
    expect(cart.subtotal).toBe(1);
    expect(cart.lines[0].lineTotal).toBe(22.5);
  });

  it('trims the name and turns absent fields into undefined', () => {
    const cart = toCart({
      ...response,
      items: [{ ...response.items[0], imageUrl: null, format: null }],
    });

    expect(cart.lines[0].name).toBe('Cola 1L');
    expect(cart.lines[0].image).toBeUndefined();
    expect(cart.lines[0].format).toBeUndefined();
  });

  it('leaves the savings fields undefined while the API omits them', () => {
    const cart = toCart(response);

    expect(cart.lines[0].discount).toBeUndefined();
    expect(cart.lines[0].basePrice).toBeUndefined();
  });

  it('carries the savings fields through once the API sends them', () => {
    const cart = toCart({
      ...response,
      items: [{ ...response.items[0], discount: 20, basePrice: 9.375 }],
    });

    expect(cart.lines[0].discount).toBe(20);
    expect(cart.lines[0].basePrice).toBe(9.375);
  });

  it('keeps unavailable lines so the customer decides what to do with them', () => {
    const cart = toCart({
      ...response,
      items: [{ ...response.items[0], isAvailable: false, available: 1 }],
    });

    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].isAvailable).toBe(false);
    expect(cart.lines[0].available).toBe(1);
  });
});
