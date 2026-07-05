import z from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().nonempty({ message: 'Nombre requerido' }),
    email: z.email({ message: 'Correo no valido' }),
    password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
    confirmPassword: z.string().nonempty({ message: 'Confirmá tu contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
