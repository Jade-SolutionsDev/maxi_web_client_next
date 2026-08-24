export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ChargeStatus =
  | 'PENDING'
  | 'REQUIRES_ACTION'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export const TERMINAL_CHARGE_STATUSES: ChargeStatus[] = [
  'SUCCEEDED',
  'FAILED',
  'EXPIRED',
  'CANCELLED',
];

export type PaymentKind = 'redirect' | 'instructions' | 'manual';

export interface PaymentMethod {
  code: string;
  label: string;
  description: string | null;
  icon: string | null;
  kind: PaymentKind;
}

export type CancellationReason =
  | 'payment_not_received'
  | 'paid_after_expiry_out_of_stock';

export interface OrderPaymentMethod {
  code: string;
  label: string;
}

export interface PaymentCharge {
  provider: string;
  kind: PaymentKind;
  reference: string;
  status: ChargeStatus;
  redirectUrl: string | null;
  depositAddress: string | null;
  amount: string | null;
  token: string | null;
  blockchain: string | null;
  currency: string | null;
  expiresAt: string | null;
  feeAmount: string | null;
  settlementAmount: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMunicipalityId: string | null;
  deliveryAddress: Record<string, string> | null;
  customerNotes: string | null;
  items?: OrderItem[];
  payment?: PaymentCharge;
  paymentMethod?: OrderPaymentMethod;
  cancellationReason: CancellationReason | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderFailure =
  | { kind: 'stale-cart'; lines: { name: string; available: number }[] }
  | { kind: 'empty-cart' }
  | { kind: 'unauthenticated' }
  | { kind: 'not-found' }
  | { kind: 'already-paid' }
  | { kind: 'payment-conflict' }
  | { kind: 'gateway-unavailable' }
  | { kind: 'no-payment' }
  | { kind: 'unknown' };

export type OrderResult =
  | { order: Order; failure?: undefined }
  | { order?: undefined; failure: OrderFailure };

export type OrderListResult =
  | { orders: Order[]; total: number; failure?: undefined }
  | { orders?: undefined; total?: undefined; failure: OrderFailure };

export type PaymentResult =
  | { payment: PaymentCharge; failure?: undefined }
  | { payment?: undefined; failure: OrderFailure };
