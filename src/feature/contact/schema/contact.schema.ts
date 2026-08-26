import z from 'zod';

export const ContactBaseSchema = z.object({
  motiveId: z.uuid({ message: 'Elige un motivo' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Contanos un poco más (mínimo 10 caracteres)' })
    .max(2000, { message: 'Máximo 2000 caracteres' }),
  website: z.string().max(255).optional(),
});

export type ContactBaseValues = z.infer<typeof ContactBaseSchema>;

export const AnonymousContactSchema = ContactBaseSchema.extend({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Nombre requerido' })
    .max(100, { message: 'Máximo 100 caracteres' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Apellidos requeridos' })
    .max(100, { message: 'Máximo 100 caracteres' }),
  email: z
    .email({ message: 'Correo no válido' })
    .max(255)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(6, { message: 'Teléfono no válido' })
    .max(40, { message: 'Teléfono no válido' })
    .optional()
    .or(z.literal('')),
}).refine((data) => Boolean(data.email) || Boolean(data.phone), {
  message: 'Dejanos un correo o un teléfono para responderte',
  path: ['email'],
});

export type AnonymousContactValues = z.infer<typeof AnonymousContactSchema>;

export const ContactFormSchema = ContactBaseSchema.extend({
  anonymous: z.boolean(),
  name: z.string().trim().max(100, { message: 'Máximo 100 caracteres' }),
  lastName: z.string().trim().max(100, { message: 'Máximo 100 caracteres' }),
  email: z
    .email({ message: 'Correo no válido' })
    .max(255)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(40, { message: 'Teléfono no válido' })
    .optional()
    .or(z.literal('')),
}).superRefine((data, ctx) => {
  if (!data.anonymous) return;
  if (!data.name) {
    ctx.addIssue({
      code: 'custom',
      path: ['name'],
      message: 'Nombre requerido',
    });
  }
  if (!data.lastName) {
    ctx.addIssue({
      code: 'custom',
      path: ['lastName'],
      message: 'Apellidos requeridos',
    });
  }
  if (!data.email && !data.phone) {
    ctx.addIssue({
      code: 'custom',
      path: ['email'],
      message: 'Dejanos un correo o un teléfono para responderte',
    });
  }
  if (data.phone && data.phone.length < 6) {
    ctx.addIssue({
      code: 'custom',
      path: ['phone'],
      message: 'Teléfono no válido',
    });
  }
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
