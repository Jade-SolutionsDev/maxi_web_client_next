import { type RefObject, useEffect } from 'react';

/**
 * Ejecuta `handler` cuando ocurre un click fuera del elemento referenciado.
 * Una sola responsabilidad: detectar el click-afuera y avisar.
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};
