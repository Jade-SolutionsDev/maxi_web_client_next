import { LifeBuoy } from 'lucide-react';

export const FulfillmentUnavailable = ({ message }: { message: string }) => (
  <output className='flex flex-col items-center gap-3 rounded-2xl bg-surface p-6 text-center'>
    <span className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
      <LifeBuoy className='size-6' aria-hidden='true' />
    </span>
    <p className='text-base font-bold text-heading'>
      No podemos completar tu pedido ahora
    </p>
    <p className='mx-auto max-w-[46ch] text-sm text-pretty text-muted'>
      {message}
    </p>
  </output>
);
