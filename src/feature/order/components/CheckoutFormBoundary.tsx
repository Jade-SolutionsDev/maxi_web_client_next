'use client';

import type { Address } from '@/feature/address/type/address.interface';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import type { FulfillmentOffer } from '../type/fulfillment.type';
import type { PaymentMethod } from '../type/order.type';
import { CheckoutForm } from './CheckoutForm';

interface CheckoutFormBoundaryProps {
  paymentMethods: PaymentMethod[];
  offer: FulfillmentOffer;
  addresses: Address[];
  catalog: LocationCatalog;
  cartKey: string;
  onDeliveryFeeChange?: (fee: number) => void;
}

export const CheckoutFormBoundary = ({
  cartKey,
  ...props
}: CheckoutFormBoundaryProps) => <CheckoutForm key={cartKey} {...props} />;
