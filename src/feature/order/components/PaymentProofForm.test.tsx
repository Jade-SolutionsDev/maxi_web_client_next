import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PaymentCharge } from '../type/order.type';
import { PaymentProofForm } from './PaymentProofForm';

const submitPaymentProofAction = vi.fn();

vi.mock('../action/order.action', () => ({
  submitPaymentProofAction: (orderId: string, formData: FormData) =>
    submitPaymentProofAction(orderId, formData),
}));

const charge = (overrides: Partial<PaymentCharge> = {}): PaymentCharge =>
  ({
    provider: 'transfermovil',
    kind: 'manual',
    reference: 'order_1_transfermovil_1',
    status: 'PENDING',
    customerReference: null,
    receiptUrl: null,
    ...overrides,
  }) as PaymentCharge;

describe('PaymentProofForm', () => {
  beforeEach(() => {
    submitPaymentProofAction.mockReset();
    submitPaymentProofAction.mockResolvedValue({
      payment: charge({ customerReference: 'TM-1' }),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('manda la referencia que escribe el cliente', async () => {
    const user = userEvent.setup();
    render(
      <PaymentProofForm
        orderId='order-1'
        charge={charge()}
        onSubmitted={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/referencia/i), 'TM-99887766');
    await user.click(
      screen.getByRole('button', { name: /enviar comprobante/i }),
    );

    await waitFor(() => expect(submitPaymentProofAction).toHaveBeenCalled());
    const [orderId, formData] = submitPaymentProofAction.mock.calls[0];
    expect(orderId).toBe('order-1');
    expect(formData.get('reference')).toBe('TM-99887766');
  });

  it('avisa al cliente cuando ya mandó el comprobante', () => {
    render(
      <PaymentProofForm
        orderId='order-1'
        charge={charge({ customerReference: 'TM-1' })}
        onSubmitted={vi.fn()}
      />,
    );

    expect(screen.getByText(/recibimos tu comprobante/i)).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: /enviar comprobante/i }),
    ).toBeNull();
  });

  it('dice algo cuando el envío falla', async () => {
    const user = userEvent.setup();
    submitPaymentProofAction.mockResolvedValue({
      failure: { kind: 'unknown' },
    });
    render(
      <PaymentProofForm
        orderId='order-1'
        charge={charge()}
        onSubmitted={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/referencia/i), 'TM-1');
    await user.click(
      screen.getByRole('button', { name: /enviar comprobante/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(/no pudimos guardar el comprobante/i),
      ).toBeTruthy(),
    );
  });
});
