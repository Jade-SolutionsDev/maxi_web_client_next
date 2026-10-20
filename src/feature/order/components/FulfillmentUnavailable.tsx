import { LifeBuoy, MapPin } from 'lucide-react';
import { textoSinEntrega } from '../lib/sin-entrega';
import type { MotivoSinEntrega } from '../type/fulfillment.type';

interface FulfillmentUnavailableProps {
  message: string;
  /** Cuál de los dos casos es. Sin él se cuenta el genérico, como antes. */
  reason?: MotivoSinEntrega | null;
}

export const FulfillmentUnavailable = ({
  message,
  reason = null,
}: FulfillmentUnavailableProps) => {
  const { titulo, salida } = textoSinEntrega(reason);
  const esZona = reason === 'fuera_de_zona';

  return (
    <output className='flex flex-col items-center gap-3 rounded-2xl bg-surface p-6 text-center'>
      <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
        {esZona ? (
          <MapPin className='size-6' aria-hidden='true' />
        ) : (
          <LifeBuoy className='size-6' aria-hidden='true' />
        )}
      </span>
      <p className='text-base font-bold text-heading'>{titulo}</p>
      <p className='mx-auto max-w-[46ch] text-sm text-pretty text-muted'>
        {message}
      </p>
      {salida && (
        <p className='mx-auto max-w-[46ch] text-sm text-pretty text-heading'>
          {salida}
        </p>
      )}
    </output>
  );
};
