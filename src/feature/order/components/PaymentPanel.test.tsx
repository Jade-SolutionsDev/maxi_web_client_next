import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Order, PaymentCharge, PaymentMethod } from '../type/order.type';
import { startPaymentAttempt } from '../action/order.action';
import { PaymentPanel } from './PaymentPanel';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../action/order.action', () => ({
  fetchPaymentStatus: vi.fn(),
  startPaymentAttempt: vi.fn(),
}));

vi.mock('../feedback/order.notify', () => ({
  notifyOrderPaid: vi.fn(),
  notifyPaymentFailure: vi.fn(),
  notifyPaymentReturn: vi.fn(),
}));

const paymentMethods: PaymentMethod[] = [
  {
    code: 'tropipay',
    label: 'Tarjeta',
    description: 'Paga con tarjeta en la pasarela segura.',
    icon: null,
    kind: 'redirect',
  },
  {
    code: 'mibilletera',
    label: 'Mi Billetera',
    description: 'Paga desde tu app de Mi Billetera.',
    icon: null,
    kind: 'instructions',
  },
];

const order: Order = {
  id: '77777777-7777-4777-8777-777777777777',
  orderNumber: 'MX-1024',
  status: 'pending',
  paymentStatus: 'pending',
  subtotal: 100,
  deliveryFee: 5,
  total: 105,
  deliveryMunicipalityId: null,
  deliveryAddress: null,
  customerNotes: null,
  items: [],
  cancellationReason: null,
  fulfillmentType: 'delivery',
  deliveryOptionLabel: 'Mensajería',
  pickupAddress: null,
  pickupLocationId: null,
  createdAt: '2026-09-03T10:00:00.000Z',
  updatedAt: '2026-09-03T10:00:00.000Z',
};

const charge = (overrides: Partial<PaymentCharge>): PaymentCharge => ({
  provider: 'tropipay',
  kind: 'redirect',
  reference: 'REF-4821',
  status: 'REQUIRES_ACTION',
  redirectUrl: null,
  depositAddress: null,
  amount: '105.00',
  token: null,
  blockchain: null,
  operationNumber: null,
  qrData: null,
  currency: 'USD',
  expiresAt: null,
  expiresInSeconds: null,
  feeAmount: null,
  settlementAmount: null,
  errorMessage: null,
  createdAt: '2026-09-03T10:00:00.000Z',
  ...overrides,
});

const START_PROMPT = 'Continuar con el pago';
const SWITCH_PROMPT = '¿Prefieres otra forma de pago?';

afterEach(cleanup);

describe('PaymentPanel', () => {
  it('muestra el enlace a la pasarela sin volver a pedir el método de pago', () => {
    render(
      <PaymentPanel
        order={order}
        payment={charge({ redirectUrl: 'https://pasarela.example/pay/4821' })}
        paymentMethods={paymentMethods}
      />,
    );

    expect(
      screen.getByRole('link', { name: /Pagar ahora/i }).getAttribute('href'),
    ).toBe('https://pasarela.example/pay/4821');
    expect(screen.queryByRole('button', { name: START_PROMPT })).toBeNull();
    expect(screen.queryByRole('radio')).toBeNull();
    expect(screen.queryByText(SWITCH_PROMPT)).toBeNull();
  });

  it('muestra la solicitud de cobro de Mi Billetera sin volver a pedir el método de pago', () => {
    render(
      <PaymentPanel
        order={order}
        payment={charge({
          provider: 'mibilletera',
          kind: 'instructions',
          operationNumber: 'OP-99120',
        })}
        paymentMethods={paymentMethods}
      />,
    );

    expect(screen.getByText('OP-99120')).toBeTruthy();
    expect(screen.queryByRole('button', { name: START_PROMPT })).toBeNull();
  });

  it('pide el método de pago cuando el pedido no tiene cobro abierto', () => {
    render(
      <PaymentPanel
        order={order}
        payment={null}
        paymentMethods={paymentMethods}
      />,
    );

    expect(screen.getByRole('button', { name: START_PROMPT })).toBeTruthy();
  });
  /**
   * Una pasarela caída dejaba al cliente en «lo confirmaremos manualmente»:
   * esa pantalla sustituía al selector, así que no podía elegir otra forma de
   * pago, y prometía una confirmación a mano que no llega cuando el pago
   * manual está desactivado — como lo está en producción.
   */
  it('deja elegir otra forma de pago cuando una pasarela falla', async () => {
    vi.mocked(startPaymentAttempt).mockResolvedValue({
      payment: null,
      failure: { kind: 'gateway-unavailable' },
    } as never);

    render(
      <PaymentPanel
        order={order}
        payment={null}
        paymentMethods={paymentMethods}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /continuar con el pago/i }),
    );

    // El selector sigue ahí, con las dos opciones.
    await waitFor(() =>
      expect(screen.getByText(/no está disponible/i)).toBeTruthy(),
    );
    expect(
      screen.getByRole('button', { name: /continuar con el pago/i }),
    ).toBeTruthy();
    // Por las opciones del selector, no por el texto suelto: «Tarjeta» también
    // aparece en el aviso, y una búsqueda ambigua probaría otra cosa.
    const opciones = screen.getAllByRole('radio');
    expect(opciones).toHaveLength(2);
    expect(opciones.map((o) => o.getAttribute('value'))).toEqual([
      'tropipay',
      'mibilletera',
    ]);
  });

  it('dice cuál falló, no un mensaje genérico', async () => {
    vi.mocked(startPaymentAttempt).mockResolvedValue({
      payment: null,
      failure: { kind: 'gateway-unavailable' },
    } as never);

    render(
      <PaymentPanel
        order={order}
        payment={null}
        paymentMethods={paymentMethods}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /continuar con el pago/i }),
    );

    const aviso = await screen.findByRole('alert');
    expect(aviso.textContent).toMatch(/tarjeta/i);
    expect(aviso.textContent).toMatch(/prueba con otra/i);
  });

  // Solo se promete confirmación a mano cuando el pago manual se ofrece.
  it('no promete confirmación manual si el pago manual no está disponible', async () => {
    vi.mocked(startPaymentAttempt).mockResolvedValue({
      payment: null,
      failure: { kind: 'gateway-unavailable' },
    } as never);

    render(
      <PaymentPanel
        order={order}
        payment={null}
        paymentMethods={paymentMethods}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /continuar con el pago/i }),
    );

    await screen.findByRole('alert');
    expect(screen.queryByText(/confirmaremos el pago manualmente/i)).toBeNull();
  });

  it('sí la promete cuando el pago manual está entre las opciones', async () => {
    vi.mocked(startPaymentAttempt).mockResolvedValue({
      payment: null,
      failure: { kind: 'gateway-unavailable' },
    } as never);

    render(
      <PaymentPanel
        order={order}
        payment={null}
        paymentMethods={[
          ...paymentMethods,
          {
            code: 'manual',
            label: 'Pago manual',
            description: null,
            icon: null,
            kind: 'manual',
          },
        ]}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /continuar con el pago/i }),
    );

    await waitFor(() =>
      expect(screen.getByText(/confirmaremos el pago manualmente/i)).toBeTruthy(),
    );
  });
});
