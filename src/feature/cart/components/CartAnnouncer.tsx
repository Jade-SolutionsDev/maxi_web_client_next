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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hydrated || status === 'idle' || status === 'loading') return;

    if (!settled.current) {
      settled.current = true;
      previous.current = totalItems;
      return;
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
