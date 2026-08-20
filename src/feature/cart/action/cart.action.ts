'use server';

import { toCartFailure } from '../lib/cart-error';
import { mergeGuestLines } from '../lib/cart-merge';
import {
  CartLineInputSchema,
  CartProductInputSchema,
  CartQuantityInputSchema,
  GuestLinesInputSchema,
} from '../schema/cart.schema';
import * as cart from '../service/cart.service';
import type { Cart, CartResult, MergeResult } from '../type/cart.interface';

const attempt = async (run: () => Promise<Cart>): Promise<CartResult> => {
  try {
    return { cart: await run() };
  } catch (error) {
    return { failure: toCartFailure(error) };
  }
};

export const fetchCart = async (): Promise<CartResult> => attempt(cart.getCart);

export const addCartLine = async (input: unknown): Promise<CartResult> => {
  const parsed = CartLineInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  return attempt(() =>
    cart.addCartItem(parsed.data.productId, parsed.data.quantity),
  );
};

export const setCartLineQuantity = async (
  input: unknown,
): Promise<CartResult> => {
  const parsed = CartQuantityInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  return attempt(() =>
    cart.setCartItemQuantity(parsed.data.productId, parsed.data.quantity),
  );
};

export const removeCartLine = async (input: unknown): Promise<CartResult> => {
  const parsed = CartProductInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  return attempt(() => cart.removeCartItem(parsed.data.productId));
};

export const clearCartLines = async (): Promise<CartResult> =>
  attempt(cart.clearCart);

export const mergeGuestCart = async (input: unknown): Promise<MergeResult> => {
  const parsed = GuestLinesInputSchema.safeParse(input);

  if (!parsed.success) return { failure: { kind: 'unknown' } };

  try {
    return await mergeGuestLines(parsed.data, {
      add: cart.addCartItem,
      setQuantity: cart.setCartItemQuantity,
      getCart: cart.getCart,
    });
  } catch (error) {
    return { failure: toCartFailure(error) };
  }
};
