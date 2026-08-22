'use client';

import { useEffect, useRef } from 'react';
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion';
import { onCartLanding } from '../flight/cart-landing';
import { registerFlightTarget } from '../flight/flight-target';
import { useCartData } from './useCart';
import { useHydrated } from './useHydrated';

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

export const useCartTrigger = () => {
  const { totalLines, status } = useCartData();
  const hydrated = useHydrated();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  /** Kept so rapid adds retarget the reaction instead of stacking it. */
  const reactionRef = useRef<Animation | null>(null);

  // Until the cart is settled the count is unknown, and rolling the badge from
  // a made-up 0 to the real number reads as items appearing on their own.
  const settled = hydrated && status !== 'idle' && status !== 'loading';
  const count = settled ? totalLines : 0;
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

  return { buttonRef, ringRef, count, hasItems, label };
};
