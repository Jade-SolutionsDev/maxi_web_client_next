import { describe, expect, it } from 'vitest';
import { mensajeSinEntrega, textoSinEntrega } from './sin-entrega';

describe('qué contar cuando no hay entrega', () => {
  /**
   * MxH-0093: los dos casos salían con el mismo texto. Este es el que **tiene
   * salida**: cambiar de zona resuelve la compra, y no decirlo pierde una
   * venta que sí se podía hacer.
   */
  it('fuera de zona ofrece cambiar de zona', () => {
    const { titulo, salida } = textoSinEntrega('fuera_de_zona');

    expect(titulo).toBe('Todavía no llegamos a tu zona');
    expect(salida).toMatch(/cámbiala|ubicación/i);
  });

  // Aquí el cliente no puede hacer nada: falta configurar la tienda. Ofrecerle
  // cambiar de zona sería mandarlo a dar vueltas para nada.
  it('sin nada configurado no inventa una salida', () => {
    const { titulo, salida } = textoSinEntrega('sin_configurar');

    expect(titulo).toBe('No podemos completar tu pedido ahora');
    expect(salida).toBeNull();
  });

  it('sin motivo se comporta como antes', () => {
    expect(textoSinEntrega(null)).toEqual(textoSinEntrega('sin_configurar'));
  });

  it('el mensaje del administrador manda sobre el de reserva', () => {
    expect(mensajeSinEntrega('Llámanos al 5251 9414.')).toBe(
      'Llámanos al 5251 9414.',
    );
    expect(mensajeSinEntrega(null)).toMatch(/Escríbenos/);
  });
});
