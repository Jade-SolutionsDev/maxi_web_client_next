import type { Product, ProductResponse } from '../type/product.interface';

/** The API sends money as decimal strings ("1.13"); the UI needs numbers. */
const toAmount = (value: string) => Number.parseFloat(value);

export const toProduct = (product: ProductResponse): Product => ({
  id: product.id,
  name: product.name.trim(),
  price: toAmount(product.basePrice),
  image: product.imageUrl ?? undefined,
});
