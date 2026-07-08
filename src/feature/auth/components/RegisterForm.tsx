'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormPassword } from '@/app/components/form/FormPassword';
import { Button } from '@/app/components/ui/button';
import { useSignUp } from '@/feature/auth/hook/useSignUp';
import {
  clerkErrorField,
  translateClerkError,
} from '@/feature/auth/lib/clerkErrors';
import {
  RegisterSchema,
  type RegisterSchemaType,
} from '@/feature/auth/schemas/register.schema';

export const RegisterForm = () => {
  'use no memo';

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { register, resendEmail, isSubmitting, isResending, emailSent } =
    useSignUp();

  const onSubmit = async (data: RegisterSchemaType) => {
    form.clearErrors();

    const { error } = await register(data);
    if (!error) return;

    form.setError(clerkErrorField(error) ?? 'root', {
      message: translateClerkError(error),
    });
  };

  if (emailSent) {
    return (
      <div className='rounded-xl bg-surface p-6 text-center'>
        <h2 className='text-lg font-bold text-heading'>Revisá tu correo</h2>
        <p className='mt-2 text-sm text-muted'>
          Te enviamos un enlace a{' '}
          <span className='font-semibold text-heading'>
            {form.getValues('email')}
          </span>
          . Hacé clic en él para confirmar tu cuenta.
        </p>
        <p className='mt-4 text-sm text-muted'>¿No te llegó?</p>
        <Button
          type='button'
          variant='secondary'
          size='lg'
          className='mt-2 w-full'
          loading={isResending}
          onClick={() => resendEmail()}
        >
          {isResending ? 'Reenviando...' : 'Reenviar correo'}
        </Button>
      </div>
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit} className='gap-5'>
      {form.formState.errors.root && (
        <p className='text-sm text-red-500'>
          {form.formState.errors.root.message}
        </p>
      )}

      <FormInput name='name' label='Nombre' placeholder='John Pérez' required />
      <FormInput
        name='email'
        label='Correo electrónico'
        type='email'
        placeholder='johndoe@email.com'
        required
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormPassword name='password' label='Contraseña' required />
        <FormPassword name='confirmPassword' label='Confirmar' required />
      </div>

      <div id='clerk-captcha'></div>

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={isSubmitting}
      >
        {isSubmitting ? 'Creando...' : 'Crear cuenta'}
      </Button>
    </Form>
  );
};
