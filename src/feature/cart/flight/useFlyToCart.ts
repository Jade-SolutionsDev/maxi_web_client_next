'use client';

import { useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { emitCartLanding } from './cart-landing';
import { flyToCart } from './fly-to-cart';

interface FlyRequest {
  /** Null-tolerant so callers can hand over a ref that has not attached yet. */
  sourceEl: HTMLElement | null;
}

/**
 * React entry point for the fly-to-cart effect.
 *
 * Reduced motion means fewer and gentler animations, not none: the ghost never
 * crosses the screen, but the cart still acknowledges the item.
 */
export const useFlyToCart = () =>
  useCallback(({ sourceEl }: FlyRequest) => {
    if (!sourceEl || prefersReducedMotion()) {
      emitCartLanding();
      return;
    }

    flyToCart({ sourceEl });
  }, []);
