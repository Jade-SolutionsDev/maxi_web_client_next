const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Format a numeric price as USD currency (e.g. 1.13 → "$1.13"). */
export const formatPrice = (value: number) => priceFormatter.format(value);
