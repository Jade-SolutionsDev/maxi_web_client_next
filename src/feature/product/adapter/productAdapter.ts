import type { Product, ProductResponse } from '../type/product.interface';

/** The API sends money as decimal strings ("1.13"); the UI needs numbers. */
const toAmount = (value: string) => Number.parseFloat(value);

export const toProduct = (product: ProductResponse): Product => {
  const price = toAmount(product.sale_price);
  const listPrice = toAmount(product.price);

  return {
    id: product.id,
    name: product.name.es.trim(),
    price,
    previousPrice: listPrice > price ? listPrice : undefined,
    image: product.standard_image,
  };
};
