import { TriangleAlert } from 'lucide-react';
import { CANCELLATION_REASON_COPY } from '../constants/order-status.constants';
import type { Order } from '../type/order.type';

export const CancellationNotice = ({ order }: { order: Order }) => {
  if (order.status !== 'cancelled' || !order.cancellationReason) return null;

  const needsRefund = order.paymentStatus === 'paid';

  return (
    <output
      className={
        needsRefund
          ? 'flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900'
          : 'flex items-start gap-3 rounded-2xl bg-surface p-4 text-sm text-muted'
      }
    >
      <TriangleAlert className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
      <p>{CANCELLATION_REASON_COPY[order.cancellationReason]}</p>
    </output>
  );
};
