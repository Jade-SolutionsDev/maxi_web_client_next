import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const cancelOrderAction = vi.fn();
const loadAccountCart = vi.fn();
const refresh = vi.fn();
const notifyOrderCancelled = vi.fn();
const notifyPaymentFailure = vi.fn();

vi.mock('../action/order.action', () => ({
  cancelOrderAction: (input: unknown) => cancelOrderAction(input),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock('@/feature/cart/hook/useCart', () => ({
  useCartActions: () => ({ loadAccountCart: () => loadAccountCart() }),
}));
vi.mock('../feedback/order.notify', () => ({
  notifyOrderCancelled: () => notifyOrderCancelled(),
  notifyPaymentFailure: (f: unknown) => notifyPaymentFailure(f),
}));

import { CancelOrderButton } from './CancelOrderButton';

/**
 * MxH-0099. Al cancelar, la API devuelve las líneas del pedido al carrito. El
 * carrito vive en el cliente, así que `router.refresh()` no lo entera: sin
 * recargarlo, el cliente se queda mirando un carrito vacío que ya no lo está.
 */
/**
 * El diálogo es modal: al abrirse, Radix saca del árbol accesible el resto de
 * la página, así que el botón que lo abrió desaparece de las consultas y hay
 * que buscar el de confirmar DENTRO del diálogo. Buscarlo por el nombre a secas
 * encuentra dos o ninguno según el momento.
 */
const abrirElDialogo = async () => {
  screen.getByRole('button', { name: /Cancelar pedido/i }).click();
  return waitFor(() => screen.getByRole('dialog'));
};

const confirmar = async () => {
  const dialogo = await abrirElDialogo();
  within(dialogo)
    .getByRole('button', { name: /^Cancelar pedido$/i })
    .click();
};

beforeEach(() => {
  cleanup();
  cancelOrderAction.mockReset();
  loadAccountCart.mockReset();
  refresh.mockReset();
  notifyOrderCancelled.mockReset();
  notifyPaymentFailure.mockReset();
});

describe('CancelOrderButton', () => {
  it('recarga el carrito cuando la cancelación sale bien', async () => {
    cancelOrderAction.mockResolvedValue({ order: { id: 'order-1' } });

    render(<CancelOrderButton orderId='order-1' />);
    await confirmar();

    await waitFor(() => expect(loadAccountCart).toHaveBeenCalled());
    expect(refresh).toHaveBeenCalled();
    expect(notifyOrderCancelled).toHaveBeenCalled();
  });

  it('no toca el carrito si la cancelación falla', async () => {
    cancelOrderAction.mockResolvedValue({ failure: { kind: 'unknown' } });

    render(<CancelOrderButton orderId='order-1' />);
    await confirmar();

    await waitFor(() => expect(notifyPaymentFailure).toHaveBeenCalled());
    expect(loadAccountCart).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('avisa de que los productos vuelven al carrito antes de confirmar', async () => {
    render(<CancelOrderButton orderId='order-1' />);
    const dialogo = await abrirElDialogo();

    expect(dialogo.textContent).toMatch(/vuelven a tu carrito/i);
  });
});
