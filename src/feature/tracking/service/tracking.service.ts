import 'server-only';

import { type ApiResponse, api } from '@/api/http';
import type { OrderTracking } from '../type/tracking.type';

/**
 * El seguimiento es público: se llama **sin sesión**, que es justo lo que hace
 * útil el enlace —se abre desde el móvil, desde el correo o desde un mensaje
 * reenviado, sin buscar contraseñas—.
 */
export async function getOrderTracking(
  trackingId: string,
): Promise<OrderTracking> {
  const respuesta = await api<ApiResponse<OrderTracking>>(
    `/storefront/tracking/${encodeURIComponent(trackingId)}`,
    // Sin caché: el cliente entra aquí justamente para ver si algo cambió.
    { cache: 'no-store' },
  );
  return respuesta.data;
}
