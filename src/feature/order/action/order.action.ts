'use server';

import { revalidatePath } from 'next/cache';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { toOrderFailure } from '../lib/order-error';
import { CheckoutInputSchema } from '../schema/checkout.schema';
import {
  OrderIdInputSchema,
  StartPaymentInputSchema,
} from '../schema/order-action.schema';
import type { CheckoutAddressPayload } from '../service/order.service';
import * as orders from '../service/order.service';
import type { FulfillmentOffer } from '../type/fulfillment.type';
import type {
  OrderListResult,
  OrderResult,
  PaymentMethod,
  PaymentResult,
} from '../type/order.type';

const toAddressPayload = (input: {
  label?: string;
  street?: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId?: string;
  contactPhone?: string;
  addressId?: string;
}): CheckoutAddressPayload | undefined => {
  if (input.addressId || !input.street || !input.municipalityId) {
    return undefined;
  }

  return {
    label: input.label || undefined,
    street: input.street,
    betweenStreets: input.betweenStreets || undefined,
    reference: input.reference || undefined,
    municipalityId: input.municipalityId,
    contactPhone: input.contactPhone || undefined,
  };
};

export const checkoutAction = async (input: unknown): Promise<OrderResult> => {
  const parsed = CheckoutInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    const { data } = parsed;
    const fallbackMunicipalityId = await readMunicipalityId();
    const order = await orders.checkout({
      fulfillmentType: data.fulfillmentType,
      deliveryOptionId: data.deliveryOptionId || undefined,
      pickupAddressId: data.pickupAddressId || undefined,
      addressId: data.addressId || undefined,
      address: toAddressPayload(data),
      saveAddress: data.saveAddress,
      deliveryMunicipalityId:
        data.municipalityId || fallbackMunicipalityId || undefined,
      paymentMethod: data.paymentMethod || undefined,
      customerNotes: data.notas || undefined,
    });

    revalidatePath('/checkout');
    revalidatePath('/pedidos');

    return { order };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchFulfillmentOffer = async (
  municipalityId?: string,
): Promise<FulfillmentOffer | null> => {
  try {
    return await orders.getFulfillmentOffer(municipalityId);
  } catch {
    return null;
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

export const fetchOrder = async (input: unknown): Promise<OrderResult> => {
  const parsed = OrderIdInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    return { order: await orders.getOrder(parsed.data.orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const cancelOrderAction = async (
  input: unknown,
): Promise<OrderResult> => {
  const parsed = OrderIdInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    return { order: await orders.cancelOrder(parsed.data.orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const fetchPaymentStatus = async (
  input: unknown,
): Promise<PaymentResult> => {
  const parsed = OrderIdInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    return { payment: await orders.getPayment(parsed.data.orderId) };
  } catch (error) {
    return { failure: toOrderFailure(error) };
  }
};

export const startPaymentAttempt = async (
  input: unknown,
): Promise<PaymentResult> => {
  const parsed = StartPaymentInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    return {
      payment: await orders.startPayment(
        parsed.data.orderId,
        parsed.data.method,
      ),
    };
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
