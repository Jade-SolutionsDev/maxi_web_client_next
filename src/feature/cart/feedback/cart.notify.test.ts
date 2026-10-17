import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notifyCartFailure } from './cart.notify';

const notify = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('@/lib/notify', () => ({ notify }));

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

describe('notifyCartFailure', () => {
  it('no culpa a la conexión cuando quien falló fue el servidor', () => {
    notifyCartFailure({ kind: 'gateway-unavailable' }, 'Cola 1L');

    const texto = dicho(notify.warning);
    expect(texto).not.toMatch(/conexi[oó]n/i);
    expect(texto).toContain('Vuelve a cargar el carrito');
  });

  it('ningún aviso del carrito acusa a la conexión del cliente', () => {
    for (const fallo of [
      { kind: 'unknown' } as const,
      { kind: 'gateway-unavailable' } as const,
      { kind: 'not-found' } as const,
      { kind: 'insufficient-stock', available: 0 } as const,
    ]) {
      notifyCartFailure(fallo, 'Cola 1L');
      const dichos = [notify.error, notify.warning, notify.info]
        .filter((fn) => fn.mock.calls.length > 0)
        .map(dicho)
        .join(' ');
      expect(dichos).not.toMatch(/conexi[oó]n/i);
      for (const fn of Object.values(notify)) fn.mockClear();
    }
  });

  it('sigue diciendo cuántas unidades quedan', () => {
    notifyCartFailure({ kind: 'insufficient-stock', available: 2 }, 'Cola 1L');

    expect(dicho(notify.warning)).toContain('Solo quedan 2 unidades');
  });

  it('una sesión caída no genera ruido', () => {
    notifyCartFailure({ kind: 'unauthenticated' }, 'Cola 1L');

    for (const fn of Object.values(notify)) expect(fn).not.toHaveBeenCalled();
  });
});
