import { auth } from '@clerk/nextjs/server';
import { PackageOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { Container } from '@/app/components/layout/Container';
import { buttonVariants } from '@/app/components/ui/button';
import { PageHero } from '@/app/components/ui/page-hero';
import { OrderCard } from '@/feature/order/components/OrderCard';
import { OrderListSkeleton } from '@/feature/order/components/OrderListSkeleton';
import { OrderPagination } from '@/feature/order/components/OrderPagination';
import {
  buildOrdersPageHref,
  ORDERS_PAGE_SIZE,
  parseOrdersPage,
} from '@/feature/order/lib/orders-pagination';
import { getOrders } from '@/feature/order/service/order.service';

export const metadata: Metadata = {
  title: 'Mis pedidos | Maxi Habana',
  robots: { index: false },
};

type OrdersPageProps = {
  searchParams: Promise<SearchParams>;
};

async function OrdersContent({ searchParams }: OrdersPageProps) {
  const { userId } = await auth();

  if (!userId) redirect('/login');

  const page = parseOrdersPage((await searchParams).page);
  const { data: orders, meta } = await getOrders(page, ORDERS_PAGE_SIZE);

  if (meta.total === 0) {
    return (
      <Container className='py-16'>
        <div className='mx-auto flex max-w-md flex-col items-center gap-4 text-center'>
          <span className='flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <PackageOpen className='size-8' aria-hidden='true' />
          </span>
          <h2 className='text-xl font-bold text-heading'>
            Todavía no tienes pedidos
          </h2>
          <p className='text-sm text-muted'>
            Cuando completes tu primera compra podrás seguirla desde aquí.
          </p>
          <Link href='/catalog' className={buttonVariants({ size: 'lg' })}>
            Explorar el catálogo
          </Link>
        </div>
      </Container>
    );
  }

  if (page > meta.totalPages) redirect(buildOrdersPageHref(meta.totalPages));

  return (
    <Container className='flex flex-col gap-6 py-8'>
      <ul className='flex flex-col gap-3' aria-label='Historial de pedidos'>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
      <OrderPagination page={page} totalPages={meta.totalPages} />
    </Container>
  );
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <main>
      <PageHero
        title='Mis pedidos'
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Mis pedidos' }]}
      />
      <Suspense fallback={<OrderListSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
