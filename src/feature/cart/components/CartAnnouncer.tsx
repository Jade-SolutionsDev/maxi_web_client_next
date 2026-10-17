'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartData } from '../hook/useCart';
import { useHydrated } from '../hook/useHydrated';

/**
 * Speaks cart changes to screen readers.
 *
 * The trigger's `aria-label` already reflects the count, but a label change on
 * an unfocused button is never announced — without this region the whole
 * add-to-cart flow is silent for anyone not watching the animation.
 */
export const CartAnnouncer = () => {
  const { totalItems, status } = useCartData();
  const hydrated = useHydrated();

  const previous = useRef(totalItems);
  /**
   * Neither rehydrating from localStorage nor the first read of the account
   * cart is a change the user made — announcing them would greet every page
   * load with "producto añadido".
   */
  const settled = useRef(false);
  const changedBeforeSettle = useRef(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      // Hydration changes the count and status together. A count that changes
      // while the cart is still unsettled can only come from a user mutation;
      // remember it so the first `ready` render does not swallow that action.
      if (totalItems !== previous.current) changedBeforeSettle.current = true;
      return;
    }

    if (!hydrated) return;

    if (!settled.current) {
      settled.current = true;

      if (changedBeforeSettle.current && totalItems !== previous.current) {
        changedBeforeSettle.current = false;
      } else {
        previous.current = totalItems;
        return;
      }
    }

    if (totalItems === previous.current) return;

    const added = totalItems > previous.current;
    previous.current = totalItems;

    setMessage(
      added
        ? `Producto añadido al carrito. ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'} en total.`
        : `Carrito actualizado. ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'} en total.`,
    );
  }, [hydrated, status, totalItems]);

  return (
    // `<output>` carries an implicit `role="status"` — polite live region, no ARIA needed.
    <output className='sr-only'>{message}</output>
  );
};
