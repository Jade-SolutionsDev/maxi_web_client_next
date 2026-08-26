import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { getAddresses } from '@/feature/address/service/address.service';
import { getCart } from '@/feature/cart/service/cart.service';
import type { Cart } from '@/feature/cart/type/cart.interface';
import {
  fetchFulfillmentOffer,
  fetchPaymentMethods,
} from '@/feature/order/action/order.action';
import { CheckoutLayout } from '@/feature/order/components/CheckoutLayout';
import type { FulfillmentOffer } from '@/feature/order/type/fulfillment.type';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getLocationCatalog } from '@/shared/location/service/location.service';
import type { LocationCatalog } from '@/shared/location/type/location.interface';

export const metadata: Metadata = {
  title: 'Finalizar compra | Maxi Habana',
  robots: { index: false },
};

const EMPTY_OFFER: FulfillmentOffer = {
  deliveryOptions: [],
  pickupPoints: [],
  pickupEnabled: false,
  unavailableMessage: null,
};

const fetchAddresses = async () => {
  try {
    return await getAddresses();
  } catch {
    return [];
  }
};

const resolveZone = (
  catalog: LocationCatalog,
  municipalityId: string | null,
) => {
  if (!municipalityId) return null;

  const municipality = Object.values(catalog.municipalitiesByProvince)
    .flat()
    .find((entry) => entry.id === municipalityId);

  return municipality
    ? { municipalityId, municipalityName: municipality.name }
    : null;
};

const cartKey = (cart: Cart) =>
  cart.lines
    .map((line) => `${line.productId}:${line.quantity}`)
    .sort()
    .join('|');

async function CheckoutContent() {
  const { userId } = await auth();

  if (!userId) redirect('/login');

  const cart = await getCart();

  if (cart.lines.length === 0) redirect('/catalog');

  const municipalityId = await readMunicipalityId();
  const [paymentMethods, offer, addresses, catalog] = await Promise.all([
    fetchPaymentMethods(),
    fetchFulfillmentOffer(municipalityId ?? undefined),
    fetchAddresses(),
    getLocationCatalog(),
  ]);

  return (
    <CheckoutLayout
      cart={cart}
      paymentMethods={paymentMethods}
      offer={offer ?? EMPTY_OFFER}
      addresses={addresses}
      catalog={catalog}
      zone={resolveZone(catalog, municipalityId)}
      cartKey={cartKey(cart)}
    />
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <PageHero
        title='Finalizar compra'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Checkout' }]}
      />
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
