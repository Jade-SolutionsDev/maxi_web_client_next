'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormPassword } from '@/app/components/form/FormPassword';
import { Button } from '@/app/components/ui/button';
import { useResetPassword } from '@/feature/auth/hook/useResetPassword';
import { notify } from '@/lib/notify';
import {
  clerkErrorTarget,
  type TranslatableClerkError,
  translateClerkError,
} from '@/feature/auth/lib/clerkErrors';
import {
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
  ResetRequestSchema,
  type ResetRequestSchemaType,
} from '@/feature/auth/schemas/reset.schema';

type StepResult = { error: TranslatableClerkError };

interface RequestCodeStepProps {
  onSubmit: (data: ResetRequestSchemaType) => Promise<StepResult>;
  isSubmitting: boolean;
}

const RequestCodeStep = ({ onSubmit, isSubmitting }: RequestCodeStepProps) => {
  'use no memo';

  const form = useForm<ResetRequestSchemaType>({
    resolver: zodResolver(ResetRequestSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = async (data: ResetRequestSchemaType) => {
    form.clearErrors();

    const { error } = await onSubmit(data);
    if (!error) return;

    form.setError(clerkErrorTarget(error, ['email']), {
      message: translateClerkError(error),
    });
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className='gap-5'>
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

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar código'}
      </Button>
    </Form>
  );
};

interface NewPasswordStepProps {
  email: string;
  onSubmit: (data: ResetPasswordSchemaType) => Promise<StepResult>;
  onResend: () => void;
  isSubmitting: boolean;
  isResending: boolean;
  resendError: TranslatableClerkError;
}

const NewPasswordStep = ({
  email,
  onSubmit,
  onResend,
  isSubmitting,
  isResending,
  resendError,
}: NewPasswordStepProps) => {
  'use no memo';

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  });

  const handleSubmit = async (data: ResetPasswordSchemaType) => {
    form.clearErrors();

    const { error } = await onSubmit(data);
    if (!error) return;

    form.setError(clerkErrorTarget(error, ['code', 'password']), {
      message: translateClerkError(error),
    });
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className='gap-5'>
      {form.formState.errors.root && (
        <p className='text-sm text-red-500'>
          {form.formState.errors.root.message}
        </p>
      )}

      <p className='text-sm text-muted'>
        Te enviamos un código a{' '}
        <span className='font-semibold text-heading'>{email}</span>. Ingresalo y
        Elige tu nueva contraseña.
      </p>

      <FormInput
        name='code'
        label='Código de verificación'
        inputMode='numeric'
        autoComplete='one-time-code'
        placeholder='000000'
        required
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormPassword name='password' label='Contraseña' required />
        <FormPassword name='confirmPassword' label='Confirmar' required />
      </div>

      <Button
        type='submit'
        size='lg'
        className='mt-2 w-full'
        loading={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
      </Button>

      <p className='text-center text-sm text-muted'>
        ¿No te llegó el código?{' '}
        <button
          type='button'
          onClick={onResend}
          disabled={isResending}
          className='font-semibold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isResending ? 'Reenviando...' : 'Reenviar'}
        </button>
      </p>
      {resendError && (
        <p className='text-center text-sm text-red-500'>
          {translateClerkError(resendError)}
        </p>
      )}
    </Form>
  );
};

export const ResetPasswordForm = () => {
  const {
    requestCode,
    resetPassword,
    resendCode,
    isSubmitting,
    isResending,
    resendError,
    codeSent,
  } = useResetPassword();

  const [email, setEmail] = useState('');

  const handleRequestCode = async (data: ResetRequestSchemaType) => {
    const result = await requestCode(data);
    if (!result.error) {
      setEmail(data.email);
    }
    return result;
  };

  const handleResetPassword = async (data: ResetPasswordSchemaType) => {
    const result = await resetPassword({
      code: data.code,
      password: data.password,
    });

    if (!result.error) {
      notify.success('Contraseña actualizada', {
        description: 'Ya podés iniciar sesión con tu nueva contraseña.',
      });
    }

    return result;
  };

  if (codeSent) {
    return (
      <NewPasswordStep
        email={email}
        onSubmit={handleResetPassword}
        onResend={resendCode}
        isSubmitting={isSubmitting}
        isResending={isResending}
        resendError={resendError}
      />
    );
  }

  return (
    <RequestCodeStep onSubmit={handleRequestCode} isSubmitting={isSubmitting} />
  );
};
