'use client';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { headerActionClass } from '@/app/components/layout/header-action.styles';
import { SheetTrigger } from '@/app/components/ui/sheet';
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { onCartLanding } from '../flight/cart-landing';
import { registerFlightTarget } from '../flight/flight-target';
import { useCartData } from '../hook/useCart';
import { useHydrated } from '../hook/useHydrated';
import { CartBadge } from './CartBadge';

const SQUASH_MS = 260;
const RING_MS = 460;

/** The cart absorbs the item's weight — this is what gives the impact mass. */
const SQUASH_KEYFRAMES = [
  { transform: 'scale(1, 1)' },
  { transform: 'scale(1.12, 0.88)', offset: 0.35 },
  { transform: 'scale(0.97, 1.03)', offset: 0.7 },
  { transform: 'scale(1, 1)' },
];

/** Shockwave leaving the button. Starts visible: nothing appears from nothing. */
const RING_KEYFRAMES = [
  { transform: 'scale(0.6)', opacity: 0.55 },
  { transform: 'scale(2.1)', opacity: 0 },
];

/** Reduced motion still acknowledges the item, just without movement. */
const PULSE_KEYFRAMES = [{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }];

export const CartTrigger = () => {
  const { totalLines } = useCartData();
  const hydrated = useHydrated();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  /** Kept so rapid adds retarget the reaction instead of stacking it. */
  const reactionRef = useRef<Animation | null>(null);

  const count = hydrated ? totalLines : 0;
  const hasItems = count > 0;
  const label = hasItems
    ? `Carrito de compra, ${count} ${count === 1 ? 'artículo' : 'artículos'}`
    : 'Carrito de compra, vacío';

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    return registerFlightTarget(button);
  }, []);

  useEffect(() => {
    return onCartLanding(() => {
      const button = buttonRef.current;
      if (!button) return;

      reactionRef.current?.cancel();

      if (prefersReducedMotion()) {
        reactionRef.current = button.animate(PULSE_KEYFRAMES, {
          duration: SQUASH_MS,
          easing: EASE_OUT,
        });
        return;
      }

      reactionRef.current = button.animate(SQUASH_KEYFRAMES, {
        duration: SQUASH_MS,
        easing: EASE_OUT,
      });

      ringRef.current?.animate(RING_KEYFRAMES, {
        duration: RING_MS,
        easing: EASE_OUT,
      });
    });
  }, []);

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
