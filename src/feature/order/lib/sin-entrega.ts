import type { MotivoSinEntrega } from '../type/fulfillment.type';

interface TextoSinEntrega {
  titulo: string;
  /** Qué puede hacer el cliente, si puede hacer algo. */
  salida: string | null;
}

const POR_OMISION =
  'Por el momento no podemos procesar tu pedido. Escríbenos y lo coordinamos.';

/**
 * Qué contarle a quien no puede recibir su pedido (MxH-0093).
 *
 * Antes los dos casos salían con el mismo «no podemos procesar pedidos en
 * línea», que suena a avería general. Uno de los dos **tiene salida**: si lo
 * que pasa es que no llegamos a su zona, cambiarla le resuelve la compra, y
 * callárselo es perder una venta que sí se podía hacer.
 */
export const textoSinEntrega = (
  motivo: MotivoSinEntrega | null,
): TextoSinEntrega =>
  motivo === 'fuera_de_zona'
    ? {
        titulo: 'Todavía no llegamos a tu zona',
        salida:
          'Si puedes recibirlo en otra zona, cámbiala desde el botón de ubicación, arriba, y sigue con tu compra.',
      }
    : {
        titulo: 'No podemos completar tu pedido ahora',
        salida: null,
      };

export const mensajeSinEntrega = (mensaje: string | null): string =>
  mensaje ?? POR_OMISION;
