import type { OrderTracking } from './type/tracking.type';

/**
 * Los pasos que el cliente espera ver, en orden, con la frase que explica cada
 * uno. Son los de MxH-0060: lo que le importa a quien espera un pedido no son
 * los estados internos, sino «¿ya salió?».
 */
export const PASOS = [
  { estado: 'Pagado', explicacion: 'Recibimos tu pedido' },
  { estado: 'En preparación', explicacion: 'Lo estamos alistando' },
  { estado: 'En camino', explicacion: 'Ya salió hacia tu dirección' },
  { estado: 'Entregado', explicacion: 'Pedido entregado' },
] as const;

/** El de recogida no «sale hacia» ninguna parte: se recoge en el mostrador. */
export const PASOS_RECOGIDA = [
  { estado: 'Pagado', explicacion: 'Recibimos tu pedido' },
  { estado: 'En preparación', explicacion: 'Lo estamos alistando' },
  { estado: 'En camino', explicacion: 'Listo para recoger' },
  { estado: 'Entregado', explicacion: 'Pedido recogido' },
] as const;

export interface PasoDeSeguimiento {
  estado: string;
  explicacion: string;
  /** Ya ocurrió: se pinta lleno y con su fecha. */
  cumplido: boolean;
  /** Es donde está el pedido ahora mismo. */
  actual: boolean;
  fecha: string | null;
}

/** Un pedido cancelado no recorre los pasos: se quedó por el camino. */
export const estaCancelado = (t: OrderTracking): boolean =>
  t.status === 'Cancelado';

/**
 * Cruza los pasos previstos con lo que de verdad le pasó al pedido.
 *
 * El estado «Pagado» no es un estado del pedido sino del cobro, así que se
 * resuelve con `paid` y con la fecha en que dejó de estar pendiente; los demás
 * salen del historial. Un paso sin fecha en el historial pero anterior al
 * estado actual cuenta como cumplido igual: si el pedido está «En camino», es
 * que se preparó, aunque nadie registrara el momento.
 */
export function construirPasos(t: OrderTracking): PasoDeSeguimiento[] {
  const plantilla = t.fulfillmentType === 'pickup' ? PASOS_RECOGIDA : PASOS;
  const fechaDe = (estado: string): string | null =>
    t.history.find((h) => h.status === estado)?.at ?? null;

  // Hasta dónde llegó, por el estado actual; «Pendiente de pago» es antes de
  // todo, así que no cumple ninguno.
  const alcanzado = plantilla.findIndex((p) => p.estado === t.status);
  const indiceActual =
    t.status === 'Pendiente de pago'
      ? -1
      : alcanzado === -1
        ? t.paid
          ? 0
          : -1
        : alcanzado;

  return plantilla.map((paso, i) => {
    const cumplido = i === 0 ? t.paid || indiceActual >= 0 : i <= indiceActual;
    const fecha =
      i === 0
        ? (fechaDe('Confirmado') ?? (t.paid ? t.placedAt : null))
        : paso.estado === 'Entregado'
          ? (t.deliveredAt ?? fechaDe(paso.estado))
          : fechaDe(paso.estado);
    return {
      estado: paso.estado,
      explicacion: paso.explicacion,
      cumplido,
      actual: i === indiceActual,
      fecha,
    };
  });
}

/**
 * Si el plazo comprometido ya pasó y el pedido no ha llegado. Se dice, no se
 * esconde: quien está esperando ya lo sabe, y ocultarlo solo añade una llamada
 * de teléfono.
 */
export function plazoVencido(t: OrderTracking, ahora = new Date()): boolean {
  if (!t.promisedAt || t.deliveredAt || estaCancelado(t)) return false;
  return new Date(t.promisedAt).getTime() < ahora.getTime();
}
