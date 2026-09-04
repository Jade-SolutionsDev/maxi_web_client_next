import { notifyCartClearedForNewProvince } from '../feedback/cart.notify';
import { useCartStore } from '../store/cart.store';

export const cartHasLines = () => useCartStore.getState().cart.lines.length > 0;

export const clearCartForNewProvince = () => {
  if (!cartHasLines()) return;

  useCartStore.getState().actions.clearCart();
  notifyCartClearedForNewProvince();
};
