/**
 * Where the cart lives on screen.
 *
 * The cart button publishes its own node here on mount; any add-to-cart action
 * reads it at click time. A module-level slot instead of React context: the
 * value is a DOM node, nothing re-renders when it changes, and callers do not
 * need a provider above them.
 */

let target: HTMLElement | null = null;

/** Registers the flight destination. Returns the cleanup for `useEffect`. */
export const registerFlightTarget = (element: HTMLElement) => {
  target = element;

  return () => {
    // Guard against a remount having already claimed the slot.
    if (target === element) target = null;
  };
};

export const getFlightTarget = () => target;
