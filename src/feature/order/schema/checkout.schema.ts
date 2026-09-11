import { z } from 'zod';
import {
  CUBAN_ID_MESSAGE,
  isCubanIdCard,
} from '@/feature/address/lib/cuban-id';
import { AddressFormSchema } from '@/feature/address/schema/address.schema';

export const CheckoutInputSchema = z
  .object({
    fulfillmentType: z.enum(['delivery', 'pickup']),
    /**
     * Quién recibe el pedido. Se pide siempre, también cuando se elige una
     * dirección ya guardada: la dirección dice dónde, no a quién, y en una
     * recogida no hay dirección ninguna de la que sacarlo.
     */
    recipientName: z
      .string()
      .trim()
      .min(1, 'Escribe el nombre y apellido')
      .max(150),
    idCard: z.string().trim().refine(isCubanIdCard, CUBAN_ID_MESSAGE),
    contactPhone: z
      .string()
      .trim()
      .regex(/^[0-9+][0-9+\s-]{5,19}$/, 'Teléfono no válido'),
    deliveryOptionId: z.string().optional(),
    pickupAddressId: z.string().optional(),
    addressId: z.string().optional(),
    saveAddress: z.boolean().optional(),
    notas: z.string().trim().max(500).optional(),
    paymentMethod: z.string().trim().max(32).optional(),
    label: z.string().optional(),
    street: z.string().optional(),
    betweenStreets: z.string().optional(),
    reference: z.string().optional(),
    provinceId: z.string().optional(),
    municipalityId: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.fulfillmentType === 'pickup') {
      if (!value.pickupAddressId) {
        ctx.addIssue({
          code: 'custom',
          path: ['pickupAddressId'],
          message: 'Elige dónde quieres recoger tu pedido',
        });
      }
      return;
    }

    if (value.addressId) return;

    const parsed = AddressFormSchema.safeParse(value);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          code: 'custom',
          path: issue.path,
          message: issue.message,
        });
      }
    }
  });

export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
