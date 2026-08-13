import type { Product } from '@/feature/product/type/product.interface';
import { recalculate } from '../lib/cart-math';
import type { Cart, CartLine, GuestLine } from '../type/cart.interface';

export const toGuestLine = (product: Product, quantity: number): GuestLine => ({
  productId: product.id,
  slug: product.slug,
  name: product.name.trim(),
  measureUnit: product.measureUnit,
  format: product.format,
  image: product.image,
  quantity,
  unitPrice: product.price,
  available: product.available,
  discount: product.discount || undefined,
});

const toCartLine = (line: GuestLine): CartLine => ({
  ...line,
  lineTotal: 0,
  // Stock was snapshotted when the product was added, so this is the guest
  // cart's best guess. The API replaces it with the truth on sign-in.
  isAvailable: line.quantity <= line.available,
});

/**
 * A guest has no server cart, so the totals are worked out here. Every
 * authenticated total comes from the API instead — see `toCart`.
 */
export const toGuestCart = (lines: GuestLine[]): Cart =>
  recalculate(lines.map(toCartLine));
