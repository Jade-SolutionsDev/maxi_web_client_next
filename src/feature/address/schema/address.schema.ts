import { z } from 'zod';

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));

/**
 * The province is part of the form because it is how a person narrows down a
 * municipality, but it never travels to the API: an address stores only the
 * municipality and the API derives the province from it.
 */
export const AddressFormSchema = z.object({
  label: optionalText(100),
  street: z.string().trim().min(1, 'Escribe la calle y el número').max(300),
  betweenStreets: optionalText(200),
  reference: optionalText(500),
  provinceId: z.string().trim().min(1, 'Elige la provincia'),
  municipalityId: z.string().trim().min(1, 'Elige el municipio'),
  contactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+][0-9+\s-]{5,19}$/, 'Teléfono no válido')
    .optional()
    .or(z.literal('')),
});

export type AddressFormValues = z.infer<typeof AddressFormSchema>;

export const AddressIdSchema = z.object({
  id: z.string().trim().min(1).max(64),
});
