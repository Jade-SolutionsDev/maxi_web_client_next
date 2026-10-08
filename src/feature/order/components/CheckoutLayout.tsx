'use client';

import { useState } from 'react';
import { Container } from '@/app/components/layout/Container';
import type { Address } from '@/feature/address/type/address.interface';
import type { Cart } from '@/feature/cart/type/cart.interface';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import type {
  FulfillmentOffer,
  FulfillmentType,
} from '../type/fulfillment.type';
import type { PaymentMethod } from '../type/order.type';
import { CheckoutFormBoundary } from './CheckoutFormBoundary';
import { CheckoutSummary } from './CheckoutSummary';

interface CheckoutLayoutProps {
  cart: Cart;
  paymentMethods: PaymentMethod[];
  offer: FulfillmentOffer;
  addresses: Address[];
  catalog: LocationCatalog;
  zone: { municipalityId: string; municipalityName: string } | null;
  cartKey: string;
  /** Subtotal desde el que el envío sale gratis, o `null` si no hay promoción. */
  freeDeliveryThreshold: number | null;
}

export const CheckoutLayout = ({
  cart,
  paymentMethods,
  offer,
  addresses,
  catalog,
  zone,
  cartKey,
  freeDeliveryThreshold,
}: CheckoutLayoutProps) => {
  const [entrega, setEntrega] = useState<{
    fee: number;
    tipo: FulfillmentType;
  }>({ fee: 0, tipo: 'pickup' });

  return (
    <Container className='grid gap-6 py-8 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-start'>
      <section
        aria-labelledby='checkout-form-title'
        className='rounded-2xl border border-input bg-background p-5 sm:p-6 lg:order-first'
      >
        <h2
          id='checkout-form-title'
          className='mb-4 text-lg font-bold text-heading'
        >
          Entrega y pago
        </h2>
        <CheckoutFormBoundary
          paymentMethods={paymentMethods}
          offer={offer}
          addresses={addresses}
          catalog={catalog}
          zone={zone}
          cartKey={cartKey}
          onEntregaChange={setEntrega}
        />
      </section>

      <CheckoutSummary
        cart={cart}
        deliveryFee={entrega.fee}
        fulfillmentType={entrega.tipo}
        freeDeliveryThreshold={freeDeliveryThreshold}
      />
    </Container>
  );
};
