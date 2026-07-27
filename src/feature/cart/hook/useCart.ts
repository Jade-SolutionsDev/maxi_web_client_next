import { computePreviousPrice } from '@/lib/product-price';
import { useCartStore } from '@/store/cart.store';

/**
 * Pre-discount prices are derived by division, so a cart with no real
 * discount can still leave a fraction of a cent behind. Anything under a
 * cent is float noise, not a saving worth showing.
 */
const MIN_SAVINGS = 0.01;

export const useCartData = () => {
  const cartItems = useCartStore((state) => state.items);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalLines = cartItems.length;
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  /** What the same cart would cost with every discount stripped out. */
  const grossTotalPrice = cartItems.reduce((acc, item) => {
    const previousPrice = computePreviousPrice(item.price, item.discount ?? 0);
    return acc + (previousPrice ?? item.price) * item.quantity;
  }, 0);

  const rawSavings = grossTotalPrice - totalPrice;
  const hasSavings = rawSavings >= MIN_SAVINGS;

  return {
    cartItems,
    totalItems,
    totalLines,
    totalPrice,
    /** Equals `totalPrice` when nothing in the cart is discounted. */
    originalTotalPrice: hasSavings ? grossTotalPrice : totalPrice,
    totalSavings: hasSavings ? rawSavings : 0,
  };
};

export const useCartActions = () => useCartStore((state) => state.actions);
