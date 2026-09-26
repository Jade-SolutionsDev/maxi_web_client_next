import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { construirPasos } from '../pasos';
import type { OrderTracking } from '../type/tracking.type';

const fecha = (iso: string) =>
  new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/**
 * La línea de tiempo del pedido. Se lee de arriba abajo en el móvil, que es
 * desde donde casi siempre se abre este enlace.
 */
export function TrackingTimeline({ tracking }: { tracking: OrderTracking }) {
  const pasos = construirPasos(tracking);

  return (
    <ol className='flex flex-col'>
      {pasos.map((paso, i) => {
        const ultimo = i === pasos.length - 1;
        return (
          <li key={paso.estado} className='flex gap-3'>
            <div className='flex flex-col items-center'>
              <span
                aria-hidden='true'
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                  paso.cumplido
                    ? 'border-primary bg-primary text-white'
                    : 'border-input bg-background text-muted',
                )}
              >
                {paso.cumplido ? (
                  <Check className='size-4' strokeWidth={3} />
                ) : (
                  <Circle className='size-3' />
                )}
              </span>
              {!ultimo && (
                <span
                  aria-hidden='true'
                  className={cn(
                    'w-0.5 flex-1',
                    paso.cumplido ? 'bg-primary' : 'bg-input',
                  )}
                />
              )}
            </div>

            <div className={cn('pb-6', ultimo && 'pb-0')}>
              <p
                className={cn(
                  'font-bold',
                  paso.cumplido ? 'text-heading' : 'text-muted',
                )}
              >
                {paso.estado}
                {paso.actual && (
                  <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
                    ahora
                  </span>
                )}
              </p>
              <p className='text-sm text-muted'>{paso.explicacion}</p>
              {paso.fecha && (
                <p className='mt-0.5 flex items-center gap-1 text-xs text-muted'>
                  <Clock className='size-3' aria-hidden='true' />
                  <time dateTime={paso.fecha}>{fecha(paso.fecha)}</time>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
