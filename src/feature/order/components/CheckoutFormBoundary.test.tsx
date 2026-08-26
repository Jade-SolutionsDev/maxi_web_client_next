import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckoutFormBoundary } from './CheckoutFormBoundary';

const checkoutAction = vi.fn();

vi.mock('../action/order.action', () => ({
  checkoutAction: (input: unknown) => checkoutAction(input),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/feature/cart/hook/useCart', () => ({
  useCartActions: () => ({ refreshIfStale: vi.fn() }),
}));

vi.mock('../feedback/order.notify', () => ({
  notifyCheckoutFailure: vi.fn(),
}));

const methods = [
  {
    code: 'tropipay',
    label: 'Tarjeta (Tropipay)',
    description: 'Pagá con tarjeta.',
    icon: 'CreditCard',
    kind: 'redirect' as const,
  },
];

const offer = {
  deliveryOptions: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      label: 'Mensajería',
      description: null,
      fee: 5,
    },
  ],
  pickupPoints: [],
  pickupEnabled: false,
  unavailableMessage: null,
};

const addresses: never[] = [];

const zone = {
  municipalityId: '55555555-5555-4555-8555-555555555555',
  municipalityName: 'Plaza',
};

const catalog = {
  provinces: [
    {
      id: '66666666-6666-4666-8666-666666666666',
      name: 'La Habana',
      code: '03',
    },
  ],
  municipalitiesByProvince: {
    '66666666-6666-4666-8666-666666666666': [
      {
        id: '55555555-5555-4555-8555-555555555555',
        provinceId: '66666666-6666-4666-8666-666666666666',
        name: 'Plaza',
        code: '0301',
      },
    ],
  },
};

const address = () => screen.getByLabelText(/Calle y número/);

describe('CheckoutFormBoundary', () => {
  beforeEach(() => {
    checkoutAction.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('starts a clean form when the cart changed', async () => {
    const { rerender } = render(
      <CheckoutFormBoundary
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
        cartKey='prod-1:1'
      />,
    );

    await userEvent.type(address(), 'Calle vieja 123');
    expect((address() as HTMLInputElement).value).toBe('Calle vieja 123');

    rerender(
      <CheckoutFormBoundary
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
        cartKey='prod-2:3'
      />,
    );

    expect((address() as HTMLInputElement).value).toBe('');
  });

  it('keeps what the customer typed while the cart is the same', async () => {
    const { rerender } = render(
      <CheckoutFormBoundary
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
        cartKey='prod-1:1'
      />,
    );

    await userEvent.type(address(), 'Calle 23');

    rerender(
      <CheckoutFormBoundary
        paymentMethods={methods}
        offer={offer}
        addresses={addresses}
        catalog={catalog}
        zone={zone}
        cartKey='prod-1:1'
      />,
    );

    expect((address() as HTMLInputElement).value).toBe('Calle 23');
  });
});
