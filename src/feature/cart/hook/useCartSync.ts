'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { useCartActions } from './useCart';

const STALE_AFTER_MS = 30_000;

/**
 * Owns the cart's lifecycle: which cart is loaded, and when it is re-read.
 *
 * Prices and stock move server-side while the tab sits open, and the same
 * customer may be editing the cart on another device, so coming back to the tab
 * re-reads it. The staleness window keeps ordinary navigation from turning every
 * click into a request.
 */
export const useCartSync = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const actions = useCartActions();
  const loadedFor = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded || loadedFor.current === isSignedIn) return;

    loadedFor.current = isSignedIn;

    if (isSignedIn) {
      void actions.adoptGuestCart();
      return;
    }

    // Signing out must not leave the previous customer's cart on screen.
    actions.hydrateGuest();
  }, [isLoaded, isSignedIn, actions]);

  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState !== 'visible') return;

      actions.refreshIfStale(STALE_AFTER_MS);
    };

    window.addEventListener('focus', revalidate);
    document.addEventListener('visibilitychange', revalidate);

    return () => {
      window.removeEventListener('focus', revalidate);
      document.removeEventListener('visibilitychange', revalidate);
    };
  }, [actions]);
};
