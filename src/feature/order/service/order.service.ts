import 'server-only';

import { type ApiResponse, apiAuth } from '@/api/http';
import type { Order, PaymentCharge } from '../type/order.type';

const ORDERS_PATH = '/storefront/orders';

const orderPath = (orderId: string) =>
  `${ORDERS_PATH}/${encodeURIComponent(orderId)}`;

interface OrdersPage {
  data: Order[];
  meta: { total: number };
}

export interface CheckoutPayload {
  deliveryMunicipalityId?: string;
  deliveryAddress?: Record<string, string>;
  customerNotes?: string;
}

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

export const startPayment = async (orderId: string): Promise<PaymentCharge> => {
  const response = await apiAuth<ApiResponse<PaymentCharge>>(
    `${orderPath(orderId)}/payment`,
    { method: 'POST' },
  );

  return response.data;
};
