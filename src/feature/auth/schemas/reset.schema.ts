import z from 'zod';

export const ResetRequestSchema = z.object({
  email: z.email({ message: 'Correo no valido' }),
});

export type ResetRequestSchemaType = z.infer<typeof ResetRequestSchema>;

export const ResetPasswordSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(6, { message: 'Código inválido' })
      .max(6, { message: 'Código inválido' }),
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

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
