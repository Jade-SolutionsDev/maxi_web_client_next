/**
 * Compute the crossed-out "previous price" for a discounted product.
 *
 * Returns `null` when there is no meaningful discount to show: a
 * `discount` of `100` would divide by zero (`Infinity`), so it — and any
 * out-of-range value — is treated the same as "no discount".
 */
export const computePreviousPrice = (
  price: number,
  discount: number,
): number | null => {
  if (discount <= 0 || discount >= 100) return null;
  return price / (1 - discount / 100);
};

/**
 * Prefer the exact `basePrice` sent by the API over recomputing it from a
 * (rounded) final price. Reversing `finalPrice / (1 - discount/100)` drifts by
 * one cent on prices the server already rounded (e.g. 1.13 / 0.9 → 1.2555…,
 * which formats as "$1.26" instead of the real "$1.25").
 */
export const resolvePreviousPrice = (
  price: number,
  discount: number,
  basePrice?: number,
): number | null => {
  if (basePrice !== undefined && basePrice > price) return basePrice;
  return computePreviousPrice(price, discount);
};
