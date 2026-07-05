import z from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'Correo no valido' }),
  password: z.string().nonempty({ message: 'Contraseña requerida' }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
