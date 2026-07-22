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
