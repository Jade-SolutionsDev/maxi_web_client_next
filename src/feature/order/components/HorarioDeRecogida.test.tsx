import { cleanup, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PickupPoint } from '../type/fulfillment.type';
import type { Order } from '../type/order.type';
import { OrderDeliveryDetails } from './OrderDeliveryDetails';
import { PickupPointSelector } from './PickupPointSelector';

/**
 * MxH-0160: el horario del mostrador.
 *
 * No existía en ninguna parte del sistema —vivía dentro del texto libre de la
 * ficha de la balita, que hoy ni se sirve—, y tres clientes lo preguntaron por
 * correo en septiembre. Ahora sale donde ya salía la dirección: al elegir
 * recogida y en la ficha del pedido.
 */
const HORARIO = '9:00 am a 3:00 pm, de lunes a viernes';

const punto = (overrides: Partial<PickupPoint> = {}): PickupPoint => ({
  id: 'pick-1',
  locationId: 'loc-1',
  locationName: 'Maxi Cárdenas',
  label: 'Mostrador',
  address: 'Calle 23 Esq. 43, Reparto Fructuoso Rodríguez',
  hours: HORARIO,
  ...overrides,
});

const pedido = (pickupHours: string | null): Order =>
  ({
    id: 'order-1',
    orderNumber: 'ORD-20260042',
    status: 'pending',
    paymentStatus: 'paid',
    fulfillmentType: 'pickup',
    pickupAddress: {
      locationName: 'Maxi Cárdenas',
      label: 'Mostrador',
      address: 'Calle 23 Esq. 43, Reparto Fructuoso Rodríguez',
      hours: pickupHours,
    },
    contactSnapshot: null,
    deliveryAddress: null,
    subtotal: 60,
    deliveryFee: 0,
    total: 60,
    createdAt: '2026-10-06T12:00:00.000Z',
    updatedAt: '2026-10-06T12:00:00.000Z',
  }) as unknown as Order;

beforeEach(() => {
  cleanup();
});

describe('al elegir recogida', () => {
  it('cada mostrador dice su horario', () => {
    render(
      <PickupPointSelector points={[punto()]} onChange={() => undefined} />,
    );

    expect(screen.getByText(HORARIO)).toBeTruthy();
  });

  it('un mostrador sin horario no enseña nada', () => {
    render(
      <PickupPointSelector
        points={[punto({ hours: null })]}
        onChange={() => undefined}
      />,
    );

    expect(screen.queryByText(/9:00/)).toBeNull();
    // Y sigue enseñando lo que ya enseñaba.
    expect(screen.getByText(/Calle 23 Esq. 43/)).toBeTruthy();
  });
});

describe('en la ficha del pedido', () => {
  it('repite el horario con el que se compró', () => {
    render(<OrderDeliveryDetails order={pedido(HORARIO)} />);

    expect(screen.getByText('Horario:')).toBeTruthy();
    expect(screen.getByText(HORARIO)).toBeTruthy();
  });

  it('un pedido anterior a esto no enseña ninguna línea', () => {
    render(<OrderDeliveryDetails order={pedido(null)} />);

    expect(screen.queryByText('Horario:')).toBeNull();
    expect(screen.getByText(/Calle 23 Esq. 43/)).toBeTruthy();
  });
});
