import { describe, expect, it } from 'vitest';
import { CheckoutInputSchema } from './checkout.schema';

const base = {
  fulfillmentType: 'pickup' as const,
  recipientName: 'Ana Rodríguez',
  idCard: '90051512345',
  contactPhone: '55512345',
  pickupAddressId: 'punto-1',
};

const analizar = (extra: Record<string, unknown> = {}) =>
  CheckoutInputSchema.safeParse({ ...base, ...extra });

describe('CheckoutInputSchema', () => {
  it('acepta una recogida con lo mínimo', () => {
    expect(analizar().success).toBe(true);
  });

  /**
   * MxH-0176. **Zod descarta las claves que no declara**, así que un campo que
   * el formulario pone y el esquema no conoce desaparece entre el formulario y
   * la acción sin que nada falle: el pedido se crea igual, pero sin protección
   * contra el duplicado.
   *
   * Ya ocurrió con `location` en MxH-0072. Esta prueba existe para que no
   * vuelva a ocurrir con la clave del intento.
   */
  describe('la clave del intento llega entera', () => {
    const CLAVE = 'a7f54e2e-7cd6-4ac2-94c7-a84a2a9d2e69';

    it('sobrevive al análisis', () => {
      const parsed = analizar({ idempotencyKey: CLAVE });

      expect(parsed.success).toBe(true);
      expect(parsed.success && parsed.data.idempotencyKey).toBe(CLAVE);
    });

    it('es opcional: sin ella el checkout sigue siendo válido', () => {
      const parsed = analizar();

      expect(parsed.success).toBe(true);
      expect(parsed.success && parsed.data.idempotencyKey).toBeUndefined();
    });

    it('rechaza una clave demasiado corta para ser única', () => {
      expect(analizar({ idempotencyKey: 'corta' }).success).toBe(false);
    });

    it('rechaza una clave más larga de lo que la columna admite', () => {
      expect(analizar({ idempotencyKey: 'x'.repeat(65) }).success).toBe(false);
    });
  });
});
