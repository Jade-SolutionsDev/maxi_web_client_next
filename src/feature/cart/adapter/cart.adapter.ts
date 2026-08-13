import type {
  Cart,
  CartItemResponse,
  CartLine,
  CartResponse,
} from '../type/cart.interface';

const toCartLine = (item: CartItemResponse): CartLine => ({
  productId: item.productId,
  slug: item.slug,
  name: item.name.trim(),
  measureUnit: item.measureUnit,
  format: item.format ?? undefined,
  image: item.imageUrl ?? undefined,
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  lineTotal: item.lineTotal,
  available: item.available,
  isAvailable: item.isAvailable,
  discount: item.discount,
  basePrice: item.basePrice,
});

/**
 * `totalItems` and `subtotal` are copied, never recomputed: the API recalculates
 * every price on every response and it is the only thing allowed to add them up.
 */
export const toCart = (response: CartResponse): Cart => ({
  lines: response.items.map(toCartLine),
  totalItems: response.totalItems,
  subtotal: response.subtotal,
});
