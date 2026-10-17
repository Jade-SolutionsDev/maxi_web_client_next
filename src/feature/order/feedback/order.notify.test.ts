import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notifyCheckoutFailure, notifyPaymentFailure } from './order.notify';

const notify = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('@/lib/notify', () => ({ notify }));

/** Todo lo que el aviso le pone delante a quien compra, en una sola cadena. */
const dicho = (llamada: ReturnType<typeof vi.fn>) => {
  const [titulo, opciones] = llamada.mock.calls.at(-1) as [
    string,
    { description?: string },
  ];
  return `${titulo} ${opciones?.description ?? ''}`;
};

beforeEach(() => {
  for (const fn of Object.values(notify)) fn.mockClear();
});

describe('notifyCheckoutFailure', () => {
  it('enseña el motivo que dio la API en vez de inventarse uno', () => {
    notifyCheckoutFailure({
      kind: 'rejected',
      reason: 'Faltan los datos de quien recoge el pedido',
    });

    expect(dicho(notify.error)).toContain(
      'Faltan los datos de quien recoge el pedido',
    );
  });

  it('nunca culpa a la conexión de un rechazo del servidor', () => {
    // El fallo de MxH-0132: cualquier 400 acababa en «Revisa tu conexión», y
    // por eso un fallo de la recogida pasó un día entero sin diagnosticar.
    for (const fallo of [
      { kind: 'rejected' } as const,
      { kind: 'rejected', reason: 'El municipio no coincide' } as const,
      { kind: 'unknown' } as const,
      { kind: 'gateway-unavailable' } as const,
    ]) {
      notifyCheckoutFailure(fallo);
      const avisos = [notify.error, notify.warning, notify.info].filter(
        (fn) => fn.mock.calls.length > 0,
      );
      expect(avisos.map(dicho).join(' ')).not.toMatch(/conexi[oó]n/i);
      for (const fn of Object.values(notify)) fn.mockClear();
    }
  });

  it('ante un tiempo agotado avisa de revisar los pedidos antes de repetir', () => {
    // La petición abandonada pudo crear el pedido igual: reintentar a ciegas
    // es como se duplica (D-055).
    notifyCheckoutFailure({ kind: 'gateway-unavailable' });

    expect(dicho(notify.warning)).toContain('Mis pedidos');
  });

  it('sigue distinguiendo el carrito vacío y la sesión caída', () => {
    notifyCheckoutFailure({ kind: 'empty-cart' });
    expect(dicho(notify.warning)).toContain('carrito está vacío');

    notifyCheckoutFailure({ kind: 'unauthenticated' });
    expect(dicho(notify.info)).toContain('Inicia sesión');
  });
});

describe('notifyPaymentFailure', () => {
  it('no echa la culpa a la forma de pago cuando el servidor tardó', () => {
    // Antes decía «Esa forma de pago no está disponible» y mandaba cambiarla:
    // las dos mitades eran falsas (D-055).
    notifyPaymentFailure({ kind: 'gateway-unavailable' });

    const texto = dicho(notify.warning);
    expect(texto).not.toMatch(/forma de pago no está disponible/i);
    expect(texto).toContain('sigue reservado');
  });

  it('enseña el motivo del rechazo y no habla de conexión', () => {
    notifyPaymentFailure({ kind: 'rejected', reason: 'Pedido ya cancelado' });

    expect(dicho(notify.error)).toContain('Pedido ya cancelado');
    expect(dicho(notify.error)).not.toMatch(/conexi[oó]n/i);
  });

  it('un pedido ya pagado se celebra, no se reporta como fallo', () => {
    notifyPaymentFailure({ kind: 'already-paid' });

    expect(notify.success).toHaveBeenCalled();
    expect(notify.error).not.toHaveBeenCalled();
  });
});
