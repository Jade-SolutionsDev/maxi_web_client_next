import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Order } from '../type/order.type';
import { CancellationNotice } from './CancellationNotice';

const order = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 'order-1',
    status: 'cancelled',
    paymentStatus: 'pending',
    cancellationReason: null,
    ...overrides,
  }) as Order;

describe('CancellationNotice', () => {
  afterEach(() => {
    cleanup();
  });

  it('explains an order that expired unpaid', () => {
    render(
      <CancellationNotice
        order={order({ cancellationReason: 'payment_not_received' })}
      />,
    );

    expect(screen.getByText(/No recibimos el pago a tiempo/)).toBeTruthy();
  });

  it('promises a refund when the payment landed too late', () => {
    render(
      <CancellationNotice
        order={order({
          paymentStatus: 'paid',
          cancellationReason: 'paid_after_expiry_out_of_stock',
        })}
      />,
    );

    expect(screen.getByText(/devolverte el importe/)).toBeTruthy();
  });

  it('says nothing for an order cancelled the ordinary way', () => {
    const { container } = render(<CancellationNotice order={order()} />);

    expect(container.firstChild).toBeNull();
  });

  it('says nothing for an order that is not cancelled', () => {
    const { container } = render(
      <CancellationNotice
        order={order({
          status: 'pending',
          cancellationReason: 'payment_not_received',
        })}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
