import { ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/helpers';
import type { Order } from '../type/order.type';
import { OrderStatusPill, PaymentStatusPill } from './OrderStatusPill';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(iso));

export const OrderCard = ({ order }: { order: Order }) => (
  <li>
    <Link
      href={`/pedidos/${order.id}`}
      className='flex items-center gap-4 rounded-2xl border border-input bg-background p-4 transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:p-5'
    >
      <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
        <ShoppingBag className='size-5' aria-hidden='true' />
      </span>

      <div className='min-w-0 flex-1'>
        <p className='truncate font-bold text-heading'>
          {order.orderNumber ?? 'Pedido'}
        </p>
        <p className='text-sm text-muted'>{formatDate(order.createdAt)}</p>
        <div className='mt-2 flex flex-wrap gap-1.5'>
          <OrderStatusPill status={order.status} />
          <PaymentStatusPill status={order.paymentStatus} />
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <p className='font-bold text-total tabular-nums'>
          {formatPrice(order.total)}
        </p>
        <ChevronRight className='size-4 text-muted' aria-hidden='true' />
      </div>
    </Link>
  </li>
);
