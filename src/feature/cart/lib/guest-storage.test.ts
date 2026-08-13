import { beforeEach, describe, expect, it } from 'vitest';
import type { GuestLine } from '../type/cart.interface';
import {
  clearGuestLines,
  readGuestLines,
  writeGuestLines,
} from './guest-storage';

const line: GuestLine = {
  productId: '0a4e',
  slug: 'cola-1l',
  name: 'Cola 1L',
  measureUnit: 'unidad',
  format: 'Botella 1 L',
  image: 'https://cdn.test/cola.webp',
  quantity: 3,
  unitPrice: 7.5,
  available: 5,
  discount: 20,
};

describe('guest storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips what it wrote', () => {
    writeGuestLines([line]);

    expect(readGuestLines()).toEqual([line]);
  });

  it('recovers a cart left by the previous zustand persist shape', () => {
    window.localStorage.setItem(
      'cart-storage',
      JSON.stringify({
        state: {
          items: [
            {
              id: '0a4e',
              slug: 'cola-1l',
              name: 'Cola 1L',
              measureUnit: 'unidad',
              format: 'Botella 1 L',
              image: 'https://cdn.test/cola.webp',
              price: 7.5,
              available: 5,
              discount: 20,
              quantity: 3,
            },
          ],
        },
        version: 0,
      }),
    );

    expect(readGuestLines()).toEqual([line]);
  });

  it('skips entries that lost the fields a line cannot be rebuilt without', () => {
    writeGuestLines([line]);
    const stored = JSON.parse(
      window.localStorage.getItem('cart-storage') ?? '{}',
    );
    stored.lines.push({
      productId: 'broken',
      quantity: 0,
      name: 'x',
      unitPrice: 1,
    });
    window.localStorage.setItem('cart-storage', JSON.stringify(stored));

    expect(readGuestLines()).toEqual([line]);
  });

  it('returns an empty cart instead of throwing on corrupted storage', () => {
    window.localStorage.setItem('cart-storage', 'not json');

    expect(readGuestLines()).toEqual([]);
  });

  it('clears the stored cart', () => {
    writeGuestLines([line]);
    clearGuestLines();

    expect(readGuestLines()).toEqual([]);
  });
});
