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

const address = () => screen.getByLabelText(/Dirección de entrega/);

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
        municipalityName={null}
        paymentMethods={methods}
        cartKey='prod-1:1'
      />,
    );

    await userEvent.type(address(), 'Calle vieja 123');
    expect((address() as HTMLInputElement).value).toBe('Calle vieja 123');

    rerender(
      <CheckoutFormBoundary
        municipalityName={null}
        paymentMethods={methods}
        cartKey='prod-2:3'
      />,
    );

    expect((address() as HTMLInputElement).value).toBe('');
  });

  it('keeps what the customer typed while the cart is the same', async () => {
    const { rerender } = render(
      <CheckoutFormBoundary
        municipalityName={null}
        paymentMethods={methods}
        cartKey='prod-1:1'
      />,
    );

    await userEvent.type(address(), 'Calle 23');

    rerender(
      <CheckoutFormBoundary
        municipalityName='Báguanos'
        paymentMethods={methods}
        cartKey='prod-1:1'
      />,
    );

    expect((address() as HTMLInputElement).value).toBe('Calle 23');
  });
});
