import { describe, expect, it } from 'vitest';
import { construirPasos, estaCancelado, plazoVencido } from './pasos';
import type { OrderTracking } from './type/tracking.type';

const base: OrderTracking = {
  orderNumber: 'ORD-20260148',
  status: 'Pendiente de pago',
  paid: false,
  placedAt: '2026-09-15T10:00:00Z',
  promiseDays: null,
  promisedAt: null,
  deliveredAt: null,
  fulfillmentType: 'delivery',
  history: [{ status: 'Pendiente de pago', at: '2026-09-15T10:00:00Z' }],
};

const con = (cambios: Partial<OrderTracking>): OrderTracking => ({
  ...base,
  ...cambios,
});

describe('construirPasos', () => {
  it('sin pagar, ningún paso está cumplido', () => {
    const pasos = construirPasos(base);
    expect(pasos.map((p) => p.cumplido)).toEqual([false, false, false, false]);
    expect(pasos.map((p) => p.estado)).toEqual([
      'Pagado',
      'En preparación',
      'En camino',
      'Entregado',
    ]);
  });

  it('pagado y confirmado, solo el primero', () => {
    const pasos = construirPasos(
      con({
        status: 'Confirmado',
        paid: true,
        history: [
          { status: 'Pendiente de pago', at: '2026-09-15T10:00:00Z' },
          { status: 'Confirmado', at: '2026-09-15T11:00:00Z' },
        ],
      }),
    );
    expect(pasos[0]).toMatchObject({ cumplido: true, actual: true });
    expect(pasos[0].fecha).toBe('2026-09-15T11:00:00Z');
    expect(pasos.slice(1).every((p) => !p.cumplido)).toBe(true);
  });

  // Lo que evita el hueco más feo: si ya va en camino, es que se preparó,
  // aunque nadie registrara ese paso.
  it('los pasos anteriores al actual cuentan aunque no estén en el historial', () => {
    const pasos = construirPasos(
      con({
        status: 'En camino',
        paid: true,
        history: [
          { status: 'Pendiente de pago', at: '2026-09-15T10:00:00Z' },
          { status: 'En camino', at: '2026-09-17T09:00:00Z' },
        ],
      }),
    );
    expect(pasos.map((p) => p.cumplido)).toEqual([true, true, true, false]);
    expect(pasos[2].actual).toBe(true);
    expect(pasos[1].fecha).toBeNull(); // cumplido, pero sin fecha que enseñar
  });

  it('entregado marca los cuatro y usa la fecha de entrega', () => {
    const pasos = construirPasos(
      con({
        status: 'Entregado',
        paid: true,
        deliveredAt: '2026-09-18T15:00:00Z',
        history: [{ status: 'Entregado', at: '2026-09-18T15:00:00Z' }],
      }),
    );
    expect(pasos.every((p) => p.cumplido)).toBe(true);
    expect(pasos[3].fecha).toBe('2026-09-18T15:00:00Z');
  });

  it('en recogida, el tercer paso no habla de direcciones', () => {
    const pasos = construirPasos(con({ fulfillmentType: 'pickup' }));
    expect(pasos[2].explicacion).toBe('Listo para recoger');
    expect(pasos[3].explicacion).toBe('Pedido recogido');
  });
});

describe('estaCancelado', () => {
  it('reconoce el pedido cancelado', () => {
    expect(estaCancelado(con({ status: 'Cancelado' }))).toBe(true);
    expect(estaCancelado(base)).toBe(false);
  });
});

describe('plazoVencido', () => {
  const ahora = new Date('2026-09-20T12:00:00Z');

  it('avisa cuando la fecha comprometida ya pasó', () => {
    expect(
      plazoVencido(
        con({ promisedAt: '2026-09-19T12:00:00Z', paid: true }),
        ahora,
      ),
    ).toBe(true);
  });

  it('no avisa si todavía queda plazo', () => {
    expect(
      plazoVencido(
        con({ promisedAt: '2026-09-21T12:00:00Z', paid: true }),
        ahora,
      ),
    ).toBe(false);
  });

  it('no avisa si ya se entregó, aunque fuera tarde', () => {
    expect(
      plazoVencido(
        con({
          promisedAt: '2026-09-19T12:00:00Z',
          deliveredAt: '2026-09-20T10:00:00Z',
        }),
        ahora,
      ),
    ).toBe(false);
  });

  it('no avisa en un pedido cancelado', () => {
    expect(
      plazoVencido(
        con({ promisedAt: '2026-09-19T12:00:00Z', status: 'Cancelado' }),
        ahora,
      ),
    ).toBe(false);
  });

  it('sin plazo comprometido no hay nada que avisar', () => {
    expect(plazoVencido(base, ahora)).toBe(false);
  });
});
