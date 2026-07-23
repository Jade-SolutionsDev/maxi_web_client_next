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
  const { totalItems } = useCartData();
  const hydrated = useHydrated();

  const previous = useRef(totalItems);
  /** Rehydrating from localStorage is not a change the user made. */
  const settled = useRef(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hydrated) return;

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
  }, [hydrated, totalItems]);

  return (
    // `<output>` carries an implicit `role="status"` — polite live region, no ARIA needed.
    <output className='sr-only'>{message}</output>
  );
};
