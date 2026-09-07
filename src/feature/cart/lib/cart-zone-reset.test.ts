import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_CART } from '../type/cart.interface';

const clearCart = vi.fn();
const notifyCartClearedForNewMunicipality = vi.fn();
const getState = vi.fn();

vi.mock('../store/cart.store', () => ({
  useCartStore: { getState: () => getState() },
}));

vi.mock('../feedback/cart.notify', () => ({
  notifyCartClearedForNewMunicipality: () =>
    notifyCartClearedForNewMunicipality(),
}));

const { cartHasLines, clearCartForNewMunicipality } = await import(
  './cart-zone-reset'
);

const stateWith = (lines: number) => ({
  cart: {
    ...EMPTY_CART,
    lines: Array.from({ length: lines }, (_, index) => ({
      productId: `product-${index}`,
    })),
  },
  actions: { clearCart },
});

describe('clearCartForNewMunicipality', () => {
  beforeEach(() => {
    clearCart.mockClear();
    notifyCartClearedForNewMunicipality.mockClear();
  });

  it('empties the cart and tells the customer why', () => {
    getState.mockReturnValue(stateWith(2));

    clearCartForNewMunicipality();

    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(notifyCartClearedForNewMunicipality).toHaveBeenCalledTimes(1);
  });

  it('stays silent when the cart was already empty', () => {
    getState.mockReturnValue(stateWith(0));

    clearCartForNewMunicipality();

    expect(clearCart).not.toHaveBeenCalled();
    expect(notifyCartClearedForNewMunicipality).not.toHaveBeenCalled();
  });
});

describe('cartHasLines', () => {
  it('is true while the cart still holds a line', () => {
    getState.mockReturnValue(stateWith(1));

    expect(cartHasLines()).toBe(true);
  });

  it('is false for an empty cart', () => {
    getState.mockReturnValue(stateWith(0));

    expect(cartHasLines()).toBe(false);
  });
});
