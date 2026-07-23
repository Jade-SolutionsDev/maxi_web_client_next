'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/app/components/ui/button';
import { SheetClose } from '@/app/components/ui/sheet';
import { cn } from '@/lib/utils';

export const CartEmpty = () => (
  <div className='flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center'>
    <span className='flex size-16 items-center justify-center rounded-full bg-surface text-accent'>
      <ShoppingCart className='size-7' aria-hidden='true' />
    </span>

    <h3 className='text-base font-bold text-heading'>Tu carrito está vacío</h3>

    <p className='max-w-[30ch] text-sm text-muted'>
      Agrega productos desde el catálogo y los verás aquí.
    </p>

    <SheetClose
      nativeButton={false}
      render={
        <Link
          href='/catalog'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'mt-2 px-6 text-sm font-semibold',
          )}
        >
          Ver catálogo
        </Link>
      }
    />
  </div>
);
