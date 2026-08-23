import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Order } from '../type/order.type';
import { OrderCard } from './OrderCard';

const order = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 'order-1',
    orderNumber: 'ORD-20260024',
    status: 'pending',
    paymentStatus: 'paid',
    subtotal: 445.49,
    deliveryFee: 0,
    total: 445.49,
    deliveryMunicipalityId: null,
    deliveryAddress: null,
    customerNotes: null,
    createdAt: '2026-08-21T20:48:00.000Z',
    updatedAt: '2026-08-21T20:48:00.000Z',
    ...overrides,
  }) as Order;

describe('OrderCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('names the method the order was paid with', () => {
    render(
      <OrderCard
        order={order({
          paymentMethod: { code: 'tropipay', label: 'Tarjeta (Tropipay)' },
        })}
      />,
    );

    expect(screen.getByText('Tarjeta (Tropipay)')).toBeTruthy();
  });

  it('omits the method when the order has no payment attempt', () => {
    render(<OrderCard order={order()} />);

    expect(screen.queryByText(/Tropipay/)).toBeNull();
  });
});
