import type { Product, ProductResponse } from '../type/product.interface';

export const toProduct = (product: ProductResponse): Product => ({
  id: product.id,
  slug: product.slug,
  name: product.name.trim(),
  price: product.finalPrice,
  discount: product.discount,
  measureUnit: product.measureUnit,
  format: product.format ?? undefined,
  image: product.imageUrl ?? undefined,
  description: product.description ?? undefined,
  category: product.category?.name.trim(),
  available: product.available,
});
