import z from 'zod';

export const InvitacionSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Mínimo 8 caracteres' })
      .max(24, { message: 'Máximo 24 caracteres' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Confirma tu contraseña' })
      .max(24, { message: 'Máximo 24 caracteres' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type InvitacionSchemaType = z.infer<typeof InvitacionSchema>;
