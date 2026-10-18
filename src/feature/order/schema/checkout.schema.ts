import { z } from 'zod';
import {
  CUBAN_ID_MESSAGE,
  isCubanIdCard,
} from '@/feature/address/lib/cuban-id';
import {
  AddressFormSchema,
  AddressLocationSchema,
} from '@/feature/address/schema/address.schema';

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
    /**
     * El punto en el mapa de la dirección nueva (MxH-0072). Hay que declararlo
     * aquí aunque `AddressFormSchema` ya lo valide: zod descarta las claves que
     * no están en el objeto, así que sin esta línea el punto se perdería entre
     * el formulario y la acción sin que nada avisara.
     */
    location: AddressLocationSchema.nullable().optional(),
    /**
     * La clave del intento (MxH-0176). Hay que declararla aquí aunque la ponga
     * el formulario justo antes de enviar: **zod descarta las claves que no
     * están en el objeto**, así que sin esta línea se perdería entre el
     * formulario y la acción, y nadie avisaría. Ya pasó con `location`.
     */
    idempotencyKey: z.string().trim().min(16).max(64).optional(),
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
