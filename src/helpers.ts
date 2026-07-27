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

/**
 * Format a discount percentage as a badge label (e.g. 20 → "-20%").
 * Trims float noise to two decimals so "-19.999999%" never reaches the UI.
 */
export const formatDiscount = (discount: number) =>
  `-${Math.round(discount * 100) / 100}%`;

/** Constrain `value` to the inclusive `[min, max]` range. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Derive up to two uppercase initials from a name.
 * "Ada Lovelace" → "AL", "Ada" → "A", "" → "".
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
};
