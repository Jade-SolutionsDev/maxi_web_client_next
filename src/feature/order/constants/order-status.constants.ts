import type {
  ChargeStatus,
  OrderPaymentStatus,
  OrderStatus,
} from '../type/order.type';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  pending: 'Pago pendiente',
  paid: 'Pagado',
  failed: 'Pago fallido',
  refunded: 'Reembolsado',
};

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  processing: 'bg-violet-100 text-violet-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-destructive/10 text-destructive',
};

export const PAYMENT_STATUS_CLASSES: Record<OrderPaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-surface text-muted',
};

export const CHARGE_FAILURE_COPY: Partial<
  Record<ChargeStatus, { title: string; description: string }>
> = {
  FAILED: {
    title: 'El pago falló',
    description:
      'La pasarela no pudo liquidar el pago. Podés generar un nuevo intento.',
  },
  EXPIRED: {
    title: 'El tiempo para pagar venció',
    description:
      'Las instrucciones anteriores ya no sirven. Generá unas nuevas para reintentar.',
  },
  CANCELLED: {
    title: 'El intento de pago fue cancelado',
    description: 'Podés generar un nuevo intento cuando quieras.',
  },
};
