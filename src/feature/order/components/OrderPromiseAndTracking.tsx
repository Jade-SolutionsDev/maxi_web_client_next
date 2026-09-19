import { CalendarClock, Share2 } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '../type/order.type';

const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(iso));

/**
 * El compromiso de entrega y el enlace para seguir el pedido sin sesión.
 *
 * Van juntos porque responden a la misma pregunta —«¿cuándo llega?»— y porque
 * el enlace es justo lo que el cliente quiere reenviar a quien va a recibirlo:
 * la persona que espera en casa no tiene por qué tener cuenta en la tienda.
 */
export function OrderPromiseAndTracking({ order }: { order: Order }) {
  const tienePlazo = Boolean(order.promisedAt || order.promiseDays);
  if (!tienePlazo && !order.trackingId) return null;

  return (
    <section className='flex flex-col gap-3 rounded-2xl border border-input bg-background p-5'>
      {tienePlazo && (
        <div className='flex items-start gap-2'>
          <CalendarClock
            className='mt-0.5 size-4 shrink-0 text-primary'
            aria-hidden='true'
          />
          <div>
            <p className='text-sm font-bold text-heading'>
              {order.promisedAt
                ? `Entrega comprometida: ${fechaLarga(order.promisedAt)}`
                : `Plazo de entrega: ${order.promiseDays} días`}
            </p>
            {!order.promisedAt && (
              <p className='text-xs text-muted'>
                Se contará desde que se confirme el pago.
              </p>
            )}
          </div>
        </div>
      )}

      {order.trackingId && (
        <div className='flex items-start gap-2'>
          <Share2
            className='mt-0.5 size-4 shrink-0 text-primary'
            aria-hidden='true'
          />
          <div>
            <p className='text-sm font-bold text-heading'>
              Seguimiento sin cuenta
            </p>
            <p className='text-xs text-muted'>
              Comparte este enlace con quien vaya a recibir el pedido: puede ver
              cómo va sin iniciar sesión.
            </p>
            <Link
              href={`/seguimiento/${order.trackingId}`}
              className='mt-1 inline-block text-sm font-semibold text-primary underline'
            >
              Ver el seguimiento
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
