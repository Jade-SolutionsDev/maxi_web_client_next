import { z } from 'zod';

export const CheckoutInputSchema = z.object({
  direccion: z.string().trim().min(5, 'Escribí la dirección de entrega'),
  referencias: z.string().trim().max(500).optional(),
  notas: z.string().trim().max(500).optional(),
  paymentMethod: z.string().trim().max(32).optional(),
});

export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
