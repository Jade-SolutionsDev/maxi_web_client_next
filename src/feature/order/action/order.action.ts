'use server';

import { revalidatePath } from 'next/cache';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { toOrderFailure } from '../lib/order-error';
import { CheckoutInputSchema } from '../schema/checkout.schema';
import * as orders from '../service/order.service';
import type {
  OrderListResult,
  OrderResult,
  PaymentMethod,
  PaymentResult,
} from '../type/order.type';

export const checkoutAction = async (input: unknown): Promise<OrderResult> => {
  const parsed = CheckoutInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    const municipalityId = await readMunicipalityId();
    const order = await orders.checkout({
      deliveryMunicipalityId: municipalityId ?? undefined,
      paymentMethod: parsed.data.paymentMethod || undefined,
      deliveryAddress: {
        direccion: parsed.data.direccion,
        ...(parsed.data.referencias
          ? { referencias: parsed.data.referencias }
          : {}),
      },
      customerNotes: parsed.data.notas || undefined,
    });

    revalidatePath('/checkout');
    revalidatePath('/pedidos');

    return { order };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchOrders = async (page: number): Promise<OrderListResult> => {
  try {
    const result = await orders.getOrders(page, 10);

    return { orders: result.data, total: result.meta.total };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchOrder = async (orderId: string): Promise<OrderResult> => {
  try {
    return { order: await orders.getOrder(orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const cancelOrderAction = async (
  orderId: string,
): Promise<OrderResult> => {
  try {
    return { order: await orders.cancelOrder(orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchPaymentStatus = async (
  orderId: string,
): Promise<PaymentResult> => {
  try {
    return { payment: await orders.getPayment(orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const startPaymentAttempt = async (
  orderId: string,
  method?: string,
): Promise<PaymentResult> => {
  try {
    return { payment: await orders.startPayment(orderId, method) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    return await orders.getPaymentMethods();
  } catch {
    return [];
  }
};
