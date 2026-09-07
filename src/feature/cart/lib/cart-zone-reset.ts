import { notifyCartClearedForNewMunicipality } from '../feedback/cart.notify';
import { useCartStore } from '../store/cart.store';

export const cartHasLines = () => useCartStore.getState().cart.lines.length > 0;

export const clearCartForNewMunicipality = () => {
  if (!cartHasLines()) return;

  useCartStore.getState().actions.clearCart();
  notifyCartClearedForNewMunicipality();
};
