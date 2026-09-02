import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkoutAction } from './order.action';

const checkout = vi.fn();
const startPayment = vi.fn();

vi.mock('../service/order.service', () => ({
  checkout: (payload: unknown) => checkout(payload),
  startPayment: (orderId: string, method?: string) =>
    startPayment(orderId, method),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('@/shared/location/cookie/location.cookie', () => ({
  readMunicipalityId: () => Promise.resolve('municipality-1'),
}));

const input = {
  fulfillmentType: 'pickup' as const,
  pickupAddressId: 'point-1',
  paymentMethod: 'tropipay',
};

describe('checkoutAction', () => {
  beforeEach(() => {
    checkout.mockReset();
    startPayment.mockReset();
    checkout.mockResolvedValue({ id: 'order-1' });
  });

  it('starts the payment with the method chosen at checkout', async () => {
    const charge = { provider: 'tropipay', status: 'REQUIRES_ACTION' };
    startPayment.mockResolvedValue(charge);

    const result = await checkoutAction(input);

    expect(startPayment).toHaveBeenCalledWith('order-1', 'tropipay');
    expect(result.order).toEqual({ id: 'order-1', payment: charge });
  });

  it('keeps the order when the payment attempt fails', async () => {
    startPayment.mockRejectedValue(new Error('gateway down'));

    const result = await checkoutAction(input);

    expect(result.order).toEqual({ id: 'order-1' });
    expect(result.failure).toBeUndefined();
  });
});
