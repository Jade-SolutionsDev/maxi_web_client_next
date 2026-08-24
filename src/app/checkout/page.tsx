import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Container } from '@/app/components/layout/Container';
import { PageHero } from '@/app/components/ui/page-hero';
import { getCart } from '@/feature/cart/service/cart.service';
import type { Cart } from '@/feature/cart/type/cart.interface';
import { fetchPaymentMethods } from '@/feature/order/action/order.action';
import { CheckoutFormBoundary } from '@/feature/order/components/CheckoutFormBoundary';
import { CheckoutSummary } from '@/feature/order/components/CheckoutSummary';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getLocationCatalog } from '@/shared/location/service/location.service';

export const metadata: Metadata = {
  title: 'Finalizar compra | Maxi Habana',
  robots: { index: false },
};

const cartKey = (cart: Cart) =>
  cart.lines
    .map((line) => `${line.productId}:${line.quantity}`)
    .sort()
    .join('|');

const resolveMunicipalityName = async (): Promise<string | null> => {
  const municipalityId = await readMunicipalityId();

  if (!municipalityId) return null;

  const catalog = await getLocationCatalog();
  const municipality = Object.values(catalog.municipalitiesByProvince)
    .flat()
    .find((entry) => entry.id === municipalityId);

  return municipality?.name ?? null;
};

async function CheckoutContent() {
  const { userId } = await auth();

  if (!userId) redirect('/login');

  const cart = await getCart();

  if (cart.lines.length === 0) redirect('/catalog');

  const [municipalityName, paymentMethods] = await Promise.all([
    resolveMunicipalityName(),
    fetchPaymentMethods(),
  ]);

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
          Datos de entrega
        </h2>
        <CheckoutFormBoundary
          municipalityName={municipalityName}
          paymentMethods={paymentMethods}
          cartKey={cartKey(cart)}
        />
      </section>

      <CheckoutSummary cart={cart} />
    </Container>
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
