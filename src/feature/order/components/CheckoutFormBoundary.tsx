'use client';

import type { PaymentMethod } from '../type/order.type';
import { CheckoutForm } from './CheckoutForm';

interface CheckoutFormBoundaryProps {
  municipalityName: string | null;
  paymentMethods: PaymentMethod[];
  /**
   * Identity of the cart being checked out. Next keeps the client subtree alive
   * across navigations, so returning to /checkout with a different cart would
   * otherwise reuse the form instance left behind by the previous order —
   * old address, old selection. A different cart is a different form.
   */
  cartKey: string;
}

export const CheckoutFormBoundary = ({
  cartKey,
  ...props
}: CheckoutFormBoundaryProps) => <CheckoutForm key={cartKey} {...props} />;
