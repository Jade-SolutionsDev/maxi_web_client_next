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
  recipientName: 'Daniel Smith',
  idCard: '91031512345',
  contactPhone: '55512345',
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

  it('manda a quien recibe el pedido, no solo dónde entregarlo', async () => {
    startPayment.mockResolvedValue({});

    await checkoutAction(input);

    expect(checkout).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: {
          recipientName: 'Daniel Smith',
          idCard: '91031512345',
          contactPhone: '55512345',
        },
      }),
    );
  });

  it('descarta un checkout con el carnet mal', async () => {
    const result = await checkoutAction({ ...input, idCard: '99023012345' });

    expect(checkout).not.toHaveBeenCalled();
    expect(result.failure).toBeDefined();
  });

  it('keeps the order when the payment attempt fails', async () => {
    startPayment.mockRejectedValue(new Error('gateway down'));

    const result = await checkoutAction(input);

    expect(result.order).toEqual({ id: 'order-1' });
    expect(result.failure).toBeUndefined();
  });
});
