'use client';

import { ShoppingCart } from 'lucide-react';
import {
  bottomNavIconClass,
  bottomNavItemClass,
} from '@/app/components/layout/bottom-nav/bottom-nav.styles';
import { SheetTrigger } from '@/app/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCartTrigger } from '../hook/useCartTrigger';
import { CartBadge } from './CartBadge';

export const CartTabTrigger = () => {
  const { buttonRef, ringRef, count, hasItems, label } = useCartTrigger();

  return (
    <SheetTrigger
      render={
        <button
          ref={buttonRef}
          type='button'
          aria-label={label}
          className={cn(
            bottomNavItemClass(false),
            'data-popup-open:text-accent',
          )}
        >
          <span className='relative'>
            <span
              ref={ringRef}
              aria-hidden='true'
              className='pointer-events-none absolute -inset-1.5 rounded-full border-2 border-primary opacity-0'
            />

            <ShoppingCart className={bottomNavIconClass} aria-hidden='true' />

            {hasItems && (
              <CartBadge
                count={count}
                className='-top-1.5 -right-2 ring-white'
              />
            )}
          </span>
          Carrito
        </button>
      }
    />
  );
};
