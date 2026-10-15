import { cleanup, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { DeliveryOption, PickupPoint } from '../type/fulfillment.type';
import type { Order } from '../type/order.type';
import { DeliveryOptionSelector } from './DeliveryOptionSelector';
import { OrderCard } from './OrderCard';
import { PickupPointSelector } from './PickupPointSelector';

/**
 * MxH-0118: el plazo se enseña al elegir la entrega y en la confirmación.
 *
 * La API lo manda desde MxH-0092 —`promiseDays` por opción y
 * `pickupPromiseDays` para la recogida— y la tienda lo tiraba: se elegía forma
 * de entrega sabiendo la tarifa y no cuándo llegaba.
 */
const opcion = (overrides: Partial<DeliveryOption> = {}): DeliveryOption => ({
  id: '11111111-1111-4111-8111-111111111111',
  label: 'Mensajería',
  description: null,
  fee: 5,
  promiseDays: 2,
  freeDeliveryThreshold: null,
  ...overrides,
});

const punto: PickupPoint = {
  id: '22222222-2222-4222-8222-222222222222',
  locationId: '33333333-3333-4333-8333-333333333333',
  locationName: 'Almacén Centro',
  label: 'Mostrador',
  address: 'Calle 1 #2',
  hours: null,
};

const pedido = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 'order-1',
    orderNumber: 'ORD-20260024',
    status: 'pending',
    paymentStatus: 'paid',
    subtotal: 60,
    deliveryFee: 0,
    total: 60,
    promiseDays: null,
    freeDeliveryThreshold: null,
    promisedAt: null,
    createdAt: '2026-09-18T20:48:00.000Z',
    updatedAt: '2026-09-18T20:48:00.000Z',
    ...overrides,
  }) as Order;

// `beforeEach` y no `afterEach`: lo que ensucia el documento es lo que corrió
// antes, y con una sola limpieza al final se cuelan nodos de otra prueba.
beforeEach(() => {
  cleanup();
});

describe('al elegir la forma de entrega', () => {
  it('cada opción dice su plazo', () => {
    render(
      <DeliveryOptionSelector
        options={[
          opcion(),
          opcion({ id: 'otra', label: 'Recogida exprés', promiseDays: 1 }),
        ]}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('Listo en 2 días hábiles')).toBeTruthy();
    expect(screen.getByText('Listo en 1 día hábil')).toBeTruthy();
  });

  it('con una sola opción también', () => {
    render(
      <DeliveryOptionSelector
        options={[opcion()]}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('Listo en 2 días hábiles')).toBeTruthy();
  });

  it('una opción sin plazo configurado no inventa ninguno', () => {
    render(
      <DeliveryOptionSelector
        options={[opcion({ promiseDays: null })]}
        onChange={() => undefined}
      />,
    );

    expect(screen.queryByText(/Listo en/)).toBeNull();
    // Y sigue enseñando lo que ya enseñaba.
    expect(screen.getByText('Mensajería')).toBeTruthy();
  });
});

describe('en la recogida', () => {
  it('el plazo sale de los ajustes y dice desde cuándo cuenta', () => {
    render(
      <PickupPointSelector
        points={[punto]}
        onChange={() => undefined}
        promiseDays={2}
      />,
    );

    expect(
      screen.getByText('Listo en 2 días hábiles desde que recibamos el pago'),
    ).toBeTruthy();
  });

  it('sin plazo configurado no dice nada', () => {
    render(
      <PickupPointSelector
        points={[punto]}
        onChange={() => undefined}
        promiseDays={null}
      />,
    );

    expect(screen.queryByText(/Listo en/)).toBeNull();
  });
});

describe('en Mis pedidos', () => {
  it('el pedido pagado enseña su fecha comprometida', () => {
    render(
      <OrderCard order={pedido({ promisedAt: '2026-09-22T16:00:00.000Z' })} />,
    );

    expect(screen.getByText('Listo el martes 22 de septiembre')).toBeTruthy();
  });

  it('el que no tiene fecha no promete nada', () => {
    render(<OrderCard order={pedido()} />);

    expect(screen.queryByText(/Listo el/)).toBeNull();
  });
});
