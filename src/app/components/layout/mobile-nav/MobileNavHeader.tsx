'use client';

import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import { MobileNavAccount } from './MobileNavAccount';

export const MobileNavHeader = () => (
  <SheetHeader className='gap-4 p-4 pb-2'>
    <div className='flex items-center justify-between gap-3'>
      <span className='text-xs font-bold tracking-widest text-muted uppercase'>
        Menú
      </span>
      <SheetClose
        render={
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='Cerrar menú'
            className='rounded-full text-heading hover:bg-surface focus-visible:ring-primary/40'
          />
        }
      >
        <X aria-hidden='true' />
      </SheetClose>
    </div>

    <SheetTitle className='sr-only'>Menú de navegación</SheetTitle>
    <SheetDescription className='sr-only'>
      Accede a las secciones de la tienda y a tu cuenta.
    </SheetDescription>

    <MobileNavAccount />
  </SheetHeader>
);
