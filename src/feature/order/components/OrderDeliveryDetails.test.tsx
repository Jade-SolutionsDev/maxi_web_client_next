import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Order } from '../type/order.type';
import { OrderDeliveryDetails } from './OrderDeliveryDetails';

const pedido = (extra: Partial<Order>): Order =>
  ({
    fulfillmentType: 'pickup',
    pickupAddress: { locationName: 'Mostrador Cárdenas', address: 'Calle 23' },
    deliveryAddress: null,
    contactSnapshot: null,
    deliveryOptionLabel: null,
    ...extra,
  }) as Order;

describe('OrderDeliveryDetails', () => {
  // Este repo no limpia el DOM solo: sin esto, un caso ve lo que pintó el
  // anterior y la prueba del pedido viejo pasaría en verde por error.
  afterEach(cleanup);

  it('en una recogida dice quién la retira, con su carnet', () => {
    render(
      <OrderDeliveryDetails
        order={pedido({
          contactSnapshot: {
            recipientName: 'Ana Pérez',
            idCard: '85042312345',
            contactPhone: '+53 5251 9414',
          },
        })}
      />,
    );

    expect(screen.getByText(/Recoge: Ana Pérez/)).toBeTruthy();
    expect(screen.getByText(/85042312345/)).toBeTruthy();
  });

  it('en una entrega dice a quién se entrega', () => {
    render(
      <OrderDeliveryDetails
        order={pedido({
          fulfillmentType: 'delivery',
          pickupAddress: null,
          deliveryAddress: { street: 'Calle 12 #345' },
          contactSnapshot: { recipientName: 'Ana Pérez' },
        })}
      />,
    );

    expect(screen.getByText(/Recibe: Ana Pérez/)).toBeTruthy();
  });

  // Los pedidos anteriores a MxH-0104 no lo llevan: mejor no enseñar el bloque
  // que enseñarlo vacío.
  it('un pedido viejo sin beneficiario no enseña el bloque', () => {
    render(<OrderDeliveryDetails order={pedido({})} />);

    expect(screen.queryByText(/Recoge:/)).toBeNull();
    expect(screen.getByText(/Mostrador Cárdenas/)).toBeTruthy();
  });
});
