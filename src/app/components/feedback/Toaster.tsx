'use client';

import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-react';
import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position='top-center'
    visibleToasts={3}
    gap={10}
    closeButton
    icons={{
      success: (
        <CircleCheck className='size-5 text-accent' aria-hidden='true' />
      ),
      warning: (
        <CircleAlert className='size-5 text-orange' aria-hidden='true' />
      ),
      error: <CircleX className='size-5 text-destructive' aria-hidden='true' />,
      info: <Info className='size-5 text-muted' aria-hidden='true' />,
    }}
    toastOptions={{
      unstyled: true,
      closeButtonAriaLabel: 'Cerrar notificación',
      classNames: {
        toast:
          'relative flex w-full items-start gap-3 rounded-2xl border border-input bg-white p-4 font-sans text-sm shadow-popover',
        icon: 'flex shrink-0 items-center pt-0.5',
        content: 'flex min-w-0 flex-1 flex-col gap-0.5',
        title: 'font-bold text-heading leading-snug',
        description: 'text-xs text-muted leading-snug',
        closeButton:
          'absolute -top-2 -right-2 flex size-7 cursor-pointer items-center justify-center rounded-full border border-input bg-white text-muted shadow-sm outline-none transition-colors hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-primary/40',
        actionButton:
          'ml-auto shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white outline-none transition hover:brightness-90 focus-visible:ring-2 focus-visible:ring-primary/40',
      },
    }}
  />
);
