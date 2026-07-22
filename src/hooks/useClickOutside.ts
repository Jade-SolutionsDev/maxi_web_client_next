import { type RefObject, useEffect, useRef } from 'react';

/**
 * Ejecuta `handler` cuando ocurre un click fuera del elemento referenciado.
 * Una sola responsabilidad: detectar el click-afuera y avisar.
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
) => {
  // Keep the latest handler in a ref so the listener effect below doesn't
  // need `handler` as a dependency — consumers that pass an inline callback
  // (re-created every render) won't cause the listener to be torn down and
  // re-subscribed on every render.
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handlerRef.current();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref]);
};
