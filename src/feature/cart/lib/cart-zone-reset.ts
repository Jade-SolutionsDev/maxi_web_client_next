import { notifyCartClearedForNewProvince } from '../feedback/cart.notify';
import { useCartStore } from '../store/cart.store';

export const clearCartForNewProvince = () => {
  const { cart, actions } = useCartStore.getState();

  if (cart.lines.length === 0) return;

  actions.clearCart();
  notifyCartClearedForNewProvince();
};
