import 'server-only';

import { type ApiOptions, type ApiResponse, apiAuth } from '@/api/http';
import { toCart } from '../adapter/cart.adapter';
import {
  type Cart,
  type CartResponse,
  EMPTY_CART,
} from '../type/cart.interface';

const CART_PATH = '/cart';
const ITEMS_PATH = `${CART_PATH}/items`;

const linePath = (productId: string) =>
  `${ITEMS_PATH}/${encodeURIComponent(productId)}`;

/**
 * Every mutation answers with the whole recalculated cart, so each of these
 * returns the new state and no caller ever needs a follow-up GET.
 */
const request = async (path: string, init: ApiOptions) => {
  const response = await apiAuth<ApiResponse<CartResponse> | null>(path, init);

  // `DELETE /cart` answers 204, which `apiAuth` surfaces as null.
  return response ? toCart(response.data) : EMPTY_CART;
};

export const getCart = (): Promise<Cart> => request(CART_PATH, {});

/** Posting a product already in the cart increments its line (2 + 1 → 3). */
export const addCartItem = (
  productId: string,
  quantity: number,
): Promise<Cart> =>
  request(ITEMS_PATH, { method: 'POST', body: { productId, quantity } });

/** Absolute overwrite. Quantity must be ≥ 1 — removing a line is a DELETE. */
export const setCartItemQuantity = (
  productId: string,
  quantity: number,
): Promise<Cart> =>
  request(linePath(productId), { method: 'PATCH', body: { quantity } });

export const removeCartItem = (productId: string): Promise<Cart> =>
  request(linePath(productId), { method: 'DELETE' });

export const clearCart = (): Promise<Cart> =>
  request(CART_PATH, { method: 'DELETE' });
