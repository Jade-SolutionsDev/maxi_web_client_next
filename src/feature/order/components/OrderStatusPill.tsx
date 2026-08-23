import { cn } from '@/lib/utils';
import {
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_CLASSES,
  PAYMENT_STATUS_LABELS,
} from '../constants/order-status.constants';
import type { OrderPaymentStatus, OrderStatus } from '../type/order.type';

const pillClass =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap';

export const OrderStatusPill = ({ status }: { status: OrderStatus }) => (
  <span className={cn(pillClass, ORDER_STATUS_CLASSES[status])}>
    {ORDER_STATUS_LABELS[status]}
  </span>
);

export const PaymentStatusPill = ({
  status,
}: {
  status: OrderPaymentStatus;
}) => (
  <span className={cn(pillClass, PAYMENT_STATUS_CLASSES[status])}>
    {PAYMENT_STATUS_LABELS[status]}
  </span>
);
