import { auth } from '@clerk/nextjs/server';
import { MapPin, StickyNote } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ApiError } from '@/api/error';
import { Container } from '@/app/components/layout/Container';
import { PageHero } from '@/app/components/ui/page-hero';
import { SafeImage } from '@/app/components/ui/safe-image';
import { fetchPaymentMethods } from '@/feature/order/action/order.action';
import { CancellationNotice } from '@/feature/order/components/CancellationNotice';
import { CancelOrderButton } from '@/feature/order/components/CancelOrderButton';
import { OrderDetailSkeleton } from '@/feature/order/components/OrderDetailSkeleton';
import {
  OrderStatusPill,
  PaymentStatusPill,
} from '@/feature/order/components/OrderStatusPill';
import { PaymentPanel } from '@/feature/order/components/PaymentPanel';
import { getOrder } from '@/feature/order/service/order.service';
import type { Order } from '@/feature/order/type/order.type';
import { formatPrice } from '@/helpers';

export const metadata: Metadata = {
  title: 'Detalle del pedido | Maxi Habana',
  robots: { index: false },
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso));

const loadOrder = async (orderId: string): Promise<Order> => {
  try {
    return await getOrder(orderId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

async function OrderDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) redirect('/login');

  const { id } = await params;
  const [order, paymentMethods] = await Promise.all([
    loadOrder(id),
    fetchPaymentMethods(),
  ]);

  return (
    <Container className='flex flex-col gap-6 py-8'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-xl font-bold text-heading'>
            {order.orderNumber ?? 'Pedido'}
          </h2>
          <p className='text-sm text-muted'>{formatDate(order.createdAt)}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <OrderStatusPill status={order.status} />
          <PaymentStatusPill status={order.paymentStatus} />
          {order.status === 'pending' && (
            <CancelOrderButton orderId={order.id} />
          )}
        </div>
      </header>

      <CancellationNotice order={order} />

      <div className='grid gap-6 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-start'>
        <div className='flex flex-col gap-6'>
          <section
            aria-labelledby='order-items-title'
            className='rounded-2xl border border-input bg-background p-5 sm:p-6'
          >
            <h3
              id='order-items-title'
              className='mb-4 text-lg font-bold text-heading'
            >
              Productos
            </h3>
            <ul className='flex flex-col divide-y divide-input'>
              {(order.items ?? []).map((item) => (
                <li
                  key={item.productId}
                  className='flex items-center gap-3 py-3'
                >
                  <SafeImage
                    src={item.imageUrl ?? undefined}
                    alt={item.name}
                    width={48}
                    height={48}
                    className='size-12 shrink-0 rounded-lg bg-surface object-cover'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-heading'>
                      {item.name}
                    </p>
                    <p className='text-xs text-muted'>
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className='shrink-0 text-sm font-bold text-heading tabular-nums'>
                    {formatPrice(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className='mt-4 flex flex-col gap-2 border-t border-input pt-4'>
              <div className='flex items-baseline justify-between'>
                <dt className='text-sm text-muted'>Subtotal</dt>
                <dd className='text-sm font-bold text-heading tabular-nums'>
                  {formatPrice(order.subtotal)}
                </dd>
              </div>
              <div className='flex items-baseline justify-between'>
                <dt className='text-sm text-muted'>Envío</dt>
                <dd className='text-sm font-bold text-heading tabular-nums'>
                  {formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className='flex items-baseline justify-between'>
                <dt className='text-base font-bold text-heading'>Total</dt>
                <dd className='text-xl font-bold text-total tabular-nums'>
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          <div className='grid gap-6 sm:grid-cols-2'>
            <section
              aria-labelledby='order-delivery-title'
              className='rounded-2xl border border-input bg-background p-5'
            >
              <h3
                id='order-delivery-title'
                className='mb-2 flex items-center gap-2 text-sm font-bold text-heading'
              >
                <MapPin className='size-4 text-primary' aria-hidden='true' />
                Entrega
              </h3>
              {order.deliveryAddress ? (
                <dl className='flex flex-col gap-1 text-sm text-muted'>
                  {Object.entries(order.deliveryAddress).map(([key, value]) => (
                    <div key={key} className='flex gap-1.5'>
                      <dt className='font-semibold capitalize'>{key}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className='text-sm text-muted'>Sin dirección registrada.</p>
              )}
            </section>

            <section
              aria-labelledby='order-notes-title'
              className='rounded-2xl border border-input bg-background p-5'
            >
              <h3
                id='order-notes-title'
                className='mb-2 flex items-center gap-2 text-sm font-bold text-heading'
              >
                <StickyNote
                  className='size-4 text-primary'
                  aria-hidden='true'
                />
                Notas
              </h3>
              <p className='text-sm text-muted'>
                {order.customerNotes || 'Sin notas.'}
              </p>
            </section>
          </div>
        </div>

        {order.status !== 'cancelled' && (
          <PaymentPanel order={order} paymentMethods={paymentMethods} />
        )}
      </div>
    </Container>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main>
      <PageHero
        title='Detalle del pedido'
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Mis pedidos', href: '/pedidos' },
          { label: 'Detalle' },
        ]}
      />
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetailContent params={params} />
      </Suspense>
    </main>
  );
}
