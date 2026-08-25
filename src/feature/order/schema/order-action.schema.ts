import { z } from 'zod';

const orderId = z.string().trim().min(1).max(64);

export const OrderIdInputSchema = z.object({ orderId });

export const StartPaymentInputSchema = z.object({
  orderId,
  method: z.string().trim().max(32).optional(),
});

export type OrderIdInput = z.infer<typeof OrderIdInputSchema>;
export type StartPaymentInput = z.infer<typeof StartPaymentInputSchema>;
