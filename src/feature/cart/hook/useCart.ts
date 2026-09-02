import { roundMoney } from '@/helpers';
import { resolvePreviousPrice } from '@/lib/product-price';
import { useCartStore } from '../store/cart.store';
import { type CartLine, EMPTY_CART } from '../type/cart.interface';

const MIN_SAVINGS = 0.01;

export const linePreviousPrice = (line: CartLine): number | null =>
  resolvePreviousPrice(line.unitPrice, line.discount ?? 0, line.basePrice);

export const useCartData = () => {
  const cart = useCartStore((state) => state.cart) ?? EMPTY_CART;
  const status = useCartStore((state) => state.status);
  const pending = useCartStore((state) => state.pending);

  const grossTotal = cart.lines.reduce((total, line) => {
    const previous = linePreviousPrice(line);
    return total + (previous ?? line.unitPrice) * line.quantity;
  }, 0);

  const rawSavings = grossTotal - cart.subtotal;
  const hasSavings = rawSavings >= MIN_SAVINGS;

  return {
    cartItems: cart.lines,
    totalItems: cart.totalItems,
    totalLines: cart.lines.length,
    /** Straight from the server for an account cart. Never recomputed here. */
    totalPrice: cart.subtotal,
    originalTotalPrice: hasSavings ? roundMoney(grossTotal) : cart.subtotal,
    totalSavings: hasSavings ? roundMoney(rawSavings) : 0,
    hasUnavailableLines: cart.lines.some((line) => !line.isAvailable),
    isPending: pending.length > 0,
    status,
  };
};

export const useCartActions = () => useCartStore((state) => state.actions);

export const useIsLinePending = (productId: string) =>
  useCartStore((state) => state.pending.includes(productId));
