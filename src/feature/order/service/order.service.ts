import 'server-only';

import { type ApiResponse, apiAuth } from '@/api/http';
import type { FulfillmentOffer } from '../type/fulfillment.type';
import type { Order, PaymentCharge, PaymentMethod } from '../type/order.type';

const ORDERS_PATH = '/storefront/orders';

const orderPath = (orderId: string) =>
  `${ORDERS_PATH}/${encodeURIComponent(orderId)}`;

interface OrdersPage {
  data: Order[];
  meta: { total: number };
}

export interface CheckoutAddressPayload {
  label?: string;
  street: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId: string;
  contactPhone?: string;
}

export interface CheckoutPayload {
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
