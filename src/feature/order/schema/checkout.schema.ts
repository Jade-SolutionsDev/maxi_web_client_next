import { z } from 'zod';
import { AddressFormSchema } from '@/feature/address/schema/address.schema';

export const CheckoutInputSchema = z
  .object({
    fulfillmentType: z.enum(['delivery', 'pickup']),
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
    contactPhone: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.fulfillmentType === 'pickup') {
      if (!value.pickupAddressId) {
        ctx.addIssue({
          code: 'custom',
          path: ['pickupAddressId'],
          message: 'Elegí dónde querés recoger tu pedido',
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
