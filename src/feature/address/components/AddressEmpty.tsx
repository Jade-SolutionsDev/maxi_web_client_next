import { MapPinPlus } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * First-run state. The action is passed in so the same "add" button serves the
 * empty state and the populated list — one dialog, one code path.
 */
export const AddressEmpty = ({ action }: { action: ReactNode }) => (
  <div className='flex flex-col items-center gap-3 rounded-xl border border-heading/10 border-dashed px-6 py-12 text-center'>
    <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-accent'>
      <MapPinPlus aria-hidden='true' className='size-6' />
    </span>

    <h2 className='font-medium text-heading text-lg'>
      Todavía no tienes direcciones guardadas
    </h2>

    <p className='max-w-sm text-heading/70 text-sm'>
      Guarda una y no tendrás que volver a escribirla en tu próxima compra.
    </p>

    {action}
  </div>
);
