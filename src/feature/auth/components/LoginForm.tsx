'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormPassword } from '@/app/components/form/FormPassword';
import { Button } from '@/app/components/ui/button';
import { useSignIn } from '@/feature/auth/hook/useSignIn';
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

  const { login, errors, isSubmitting } = useSignIn();

  const onSubmit = async (data: LoginSchemaType) => {
    const { error } = await login(data);

    if (errors.fields.identifier) {
      form.setError('email', { message: errors.fields.identifier.message });
    }
    if (errors.fields.password) {
      form.setError('password', { message: errors.fields.password.message });
    }
    if (error && !errors.fields.identifier && !errors.fields.password) {
      form.setError('root', { message: error.message });
    }
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

      <button
        type='button'
        className='text-center text-sm font-medium text-heading transition-colors hover:text-primary'
      >
        ¿Olvidaste tu contraseña?
      </button>
    </Form>
  );
};
