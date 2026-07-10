'use client';

import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import logo from '@/assets/logo.svg';
import { MobileNavAccount } from './MobileNavAccount';

export const MobileNavHeader = () => (
  <SheetHeader className='gap-4 bg-primary p-4 pb-5'>
    <div className='flex items-center justify-between gap-3'>
      <Image src={logo} alt='Maxi Habana' className='h-8 w-auto' />
      <SheetClose
        render={
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='Cerrar menú'
            className='rounded-lg text-white hover:bg-white/15 focus-visible:ring-white/60'
          />
        }
      >
        <span aria-hidden='true' className='text-xl leading-none'>
          &times;
        </span>
      </SheetClose>
    </div>

    <SheetTitle className='sr-only'>Menú de navegación</SheetTitle>
    <SheetDescription className='sr-only'>
      Accedé a las secciones de la tienda y a tu cuenta.
    </SheetDescription>

    <MobileNavAccount />
  </SheetHeader>
);
