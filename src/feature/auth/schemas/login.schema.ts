import z from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'Correo no válido' }),
  password: z.string().nonempty({ message: 'Contraseña requerida' }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
