/**
 * Shared pure helpers. Check this file before writing a new utility —
 * duplicating one that already lives here is how the codebase drifts.
 */

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Format a numeric price as USD currency (e.g. 1.13 → "$1.13"). */
export const formatPrice = (value: number) => priceFormatter.format(value);

/** Constrain `value` to the inclusive `[min, max]` range. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
