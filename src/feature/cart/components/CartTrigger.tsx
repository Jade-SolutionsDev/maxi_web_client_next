'use client';

import { ShoppingCart } from 'lucide-react';
import { headerActionClass } from '@/app/components/layout/header-action.styles';
import { SheetTrigger } from '@/app/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCartTrigger } from '../hook/useCartTrigger';
import { CartBadge } from './CartBadge';

export const CartTrigger = () => {
  const { buttonRef, ringRef, count, hasItems, label } = useCartTrigger();

  return (
    <SheetTrigger
      render={
        <button
          ref={buttonRef}
          type='button'
          aria-label={label}
          className={cn(
            headerActionClass,
            'relative active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100',
          )}
        >
          <span
            ref={ringRef}
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 rounded-full border-2 border-white opacity-0'
          />

          <ShoppingCart className='size-5 md:size-5.5' aria-hidden='true' />

          {hasItems && <CartBadge count={count} />}
        </button>
      }
    />
  );
};
