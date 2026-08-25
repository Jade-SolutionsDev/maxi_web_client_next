import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckoutForm } from './CheckoutForm';

const checkoutAction = vi.fn();
const push = vi.fn();
const refresh = vi.fn();

vi.mock('../action/order.action', () => ({
  checkoutAction: (input: unknown) => checkoutAction(input),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

const markCheckedOut = vi.fn();
vi.mock('@/feature/cart/hook/useCart', () => ({
  useCartActions: () => ({ markCheckedOut: () => markCheckedOut() }),
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
  {
    code: 'manual',
    label: 'Pago manual',
    description: 'Coordinamos el pago.',
    icon: 'HandCoins',
    kind: 'manual' as const,
  },
];

const submit = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Dirección de entrega/), 'Calle 23');
  await user.click(screen.getByRole('button', { name: /Confirmar pedido/ }));
};

describe('CheckoutForm', () => {
  beforeEach(() => {
    checkoutAction.mockReset();
    push.mockReset();
    refresh.mockReset();
    markCheckedOut.mockReset();
    checkoutAction.mockResolvedValue({ order: { id: 'order-1' } });
  });

  afterEach(() => {
    cleanup();
  });

  it('tells the cart it was emptied instead of re-reading it', async () => {
    // Re-reading is a server action, and a server action re-renders the page
    // it fires from: `/checkout` would redirect to the catalogue and beat the
    // navigation to the new order.
    render(<CheckoutForm municipalityName={null} paymentMethods={methods} />);

    await submit();

    await waitFor(() => expect(markCheckedOut).toHaveBeenCalled());
  });

  it('navigates to the order once the checkout succeeds', async () => {
    render(
      <CheckoutForm municipalityName='Báguanos' paymentMethods={methods} />,
    );

    await submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith('/pedidos/order-1'));
  });

  it('keeps the button busy while the order is being created', async () => {
    let release: (value: unknown) => void = () => {};
    checkoutAction.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    render(<CheckoutForm municipalityName={null} paymentMethods={methods} />);

    await submit();

    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));

    await act(async () => {
      release({ order: { id: 'order-1' } });
    });
  });

  it('does not leave the button busy once navigation is done', async () => {
    render(<CheckoutForm municipalityName={null} paymentMethods={methods} />);

    await submit();
    await waitFor(() => expect(push).toHaveBeenCalled());

    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => {
      expect(button.getAttribute('aria-busy')).toBe('false');
      expect((button as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it('blocks a second submit while the order is being created', async () => {
    let release: (value: unknown) => void = () => {};
    checkoutAction.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    render(<CheckoutForm municipalityName={null} paymentMethods={methods} />);

    await submit();
    const button = screen.getByRole('button', { name: /Confirmar pedido/ });
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));

    await userEvent.click(button);
    expect(checkoutAction).toHaveBeenCalledTimes(1);

    await act(async () => {
      release({ order: { id: 'order-1' } });
    });
  });
});
