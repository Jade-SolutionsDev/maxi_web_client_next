/**
 * Where the cart lives on screen.
 *
 * Every cart button publishes its own node here on mount; any add-to-cart
 * action reads it at click time. A module-level registry instead of React
 * context: the values are DOM nodes, nothing re-renders when they change, and
 * callers do not need a provider above them.
 *
 * More than one button is registered at a time — the header holds one from
 * `md` up and the bottom tab bar holds another below it — so the reader picks
 * the candidate that is actually laid out instead of trusting mount order.
 */

const candidates = new Set<HTMLElement>();

/** Registers a flight destination. Returns the cleanup for `useEffect`. */
export const registerFlightTarget = (element: HTMLElement) => {
  candidates.add(element);

  return () => {
    candidates.delete(element);
  };
};

/** An element hidden by `display: none` reports no client rects. */
const isRendered = (element: HTMLElement) =>
  element.getClientRects().length > 0;

export const getFlightTarget = () => {
  for (const candidate of candidates) {
    if (isRendered(candidate)) return candidate;
  }

  return null;
};
