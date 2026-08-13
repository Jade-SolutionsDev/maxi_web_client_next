import { z } from 'zod';

const MAX_MERGE_LINES = 100;

const productId = z.string().trim().min(1).max(64);

const quantity = z.int().min(1).max(9999);

export const CartLineInputSchema = z.object({ productId, quantity });

export const CartQuantityInputSchema = z.object({ productId, quantity });

export const CartProductInputSchema = z.object({ productId });

export const GuestLinesInputSchema = z
  .array(z.object({ productId, quantity, name: z.string().trim().max(200) }))
  .max(MAX_MERGE_LINES);
