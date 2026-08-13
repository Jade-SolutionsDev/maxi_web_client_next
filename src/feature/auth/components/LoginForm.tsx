'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormPassword } from '@/app/components/form/FormPassword';
import { Button } from '@/app/components/ui/button';
import { useSignIn } from '@/feature/auth/hook/useSignIn';
import {
  clerkErrorTarget,
  translateClerkError,
} from '@/feature/auth/lib/clerkErrors';
import {
  LoginSchema,
  type LoginSchemaType,
} from '@/feature/auth/schemas/login.schema';

export const LoginForm = () => {
  'use no memo';

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { login, isSubmitting } = useSignIn();

  const onSubmit = async (data: LoginSchemaType) => {
    form.clearErrors();

    const { error } = await login(data);
    if (!error) return;

    form.setError(clerkErrorTarget(error, ['email', 'password']), {
      message: translateClerkError(error),
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className='gap-5'>
      {form.formState.errors.root && (
        <p className='text-sm text-red-500'>
          {form.formState.errors.root.message}
        </p>
      )}

      <FormInput
        name='email'
        label='Correo electrónico'
        type='email'
        placeholder='johndoe@email.com'
        required
      />
      <FormPassword name='password' label='Contraseña' required />

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={isSubmitting}
      >
        {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
      </Button>

      <Link
        href='/reset-password'
        className='text-center text-sm font-medium text-primary transition-colors hover:underline'
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </Form>
  );
};
