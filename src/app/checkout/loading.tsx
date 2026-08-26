import { PageHero } from '@/app/components/ui/page-hero';
import { CheckoutSkeleton } from '@/feature/order/components/CheckoutSkeleton';

export default function Loading() {
  return (
    <main>
      <PageHero
        title='Finalizar compra'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Checkout' }]}
      />
      <CheckoutSkeleton />
    </main>
  );
}
