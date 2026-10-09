import 'server-only';

import { type ApiResponse, api, apiAuth } from '@/api/http';
import type {
  FulfillmentOffer,
  PublicFulfillment,
} from '../type/fulfillment.type';
import type { Order, PaymentCharge, PaymentMethod } from '../type/order.type';

const ORDERS_PATH = '/storefront/orders';

const orderPath = (orderId: string) =>
  `${ORDERS_PATH}/${encodeURIComponent(orderId)}`;

interface OrdersPage {
  data: Order[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CheckoutAddressPayload {
  recipientName?: string;
  idCard?: string;
  label?: string;
  street: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId: string;
  contactPhone?: string;
}

export interface CheckoutContactPayload {
  recipientName: string;
  idCard: string;
  contactPhone: string;
}

export interface CheckoutPayload {
  contact?: CheckoutContactPayload;
  fulfillmentType?: 'delivery' | 'pickup';
  deliveryOptionId?: string;
  pickupAddressId?: string;
  addressId?: string;
  address?: CheckoutAddressPayload;
  saveAddress?: boolean;
  deliveryMunicipalityId?: string;
  customerNotes?: string;
  paymentMethod?: string;
}

/**
 * Si en esta zona se puede recibir algo. Va por la ruta pública y con `api()`,
 * no `apiAuth()`: quien está llenando el carrito puede no haber entrado todavía
 * y es justo a quien hay que avisarle antes de que llegue al final (P-046).
 */
export const getDisponibilidadDeLaZona = async (
  municipalityId?: string,
): Promise<PublicFulfillment> => {
  const response = await api<ApiResponse<PublicFulfillment>>(
    '/public/fulfillment/availability',
    municipalityId ? { params: { municipalityId } } : undefined,
  );

  return response.data;
};

export const getFulfillmentOffer = async (
  municipalityId?: string,
): Promise<FulfillmentOffer> => {
  const response = await apiAuth<ApiResponse<FulfillmentOffer>>(
    '/storefront/fulfillment',
    municipalityId ? { params: { municipalityId } } : undefined,
  );

  return response.data;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await apiAuth<ApiResponse<PaymentMethod[]>>(
    '/storefront/payment-methods',
  );

  return response.data;
};

export const checkout = async (payload: CheckoutPayload): Promise<Order> => {
  const response = await apiAuth<ApiResponse<Order>>(ORDERS_PATH, {
    method: 'POST',
    body: payload,
  });

  return response.data;
};

export const submitPaymentProof = async (
  orderId: string,
  reference: string,
  receipt?: File | null,
): Promise<PaymentCharge> => {
  const form = new FormData();
  form.append('reference', reference);
  if (receipt) form.append('receipt', receipt);

  const response = await apiAuth<ApiResponse<PaymentCharge>>(
    `${orderPath(orderId)}/payment/proof`,
    { method: 'POST', body: form },
  );

  return response.data;
};

export const getOrders = async (
  page: number,
  limit: number,
): Promise<OrdersPage> => {
  const response = await apiAuth<ApiResponse<OrdersPage>>(ORDERS_PATH, {
    params: { page, limit },
  });

  return response.data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const response = await apiAuth<ApiResponse<Order>>(orderPath(orderId));

  return response.data;
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await apiAuth<ApiResponse<Order>>(
    `${orderPath(orderId)}/cancel`,
    { method: 'POST' },
  );

  return response.data;
};

export const getPayment = async (orderId: string): Promise<PaymentCharge> => {
  const response = await apiAuth<ApiResponse<PaymentCharge>>(
    `${orderPath(orderId)}/payment`,
  );

  return response.data;
};

export const startPayment = async (
  orderId: string,
  method?: string,
): Promise<PaymentCharge> => {
  const response = await apiAuth<ApiResponse<PaymentCharge>>(
    `${orderPath(orderId)}/payment`,
    { method: 'POST', body: method ? { method } : {} },
  );

  return response.data;
};
