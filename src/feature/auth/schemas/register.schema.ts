import z from 'zod';

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Nombre requerido' })
      .max(24, { message: 'Máximo 24 caracteres' }),
    email: z.email({ message: 'Correo no valido' }),
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

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
