import { useCartStore } from '@/store/cart.store';

export const useCartData = () => {
  const cartItems = useCartStore((state) => state.items);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalLines = cartItems.length;
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return { cartItems, totalItems, totalLines, totalPrice };
};

export const useCartActions = () => useCartStore((state) => state.actions);
