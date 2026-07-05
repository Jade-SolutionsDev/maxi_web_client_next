'use client';

import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { signUp } = useSignUp();
  const status = signUp?.verifications.emailLinkVerification?.status ?? null;

  const failed = status === 'expired' || status === 'failed';

  return (
    <div className='flex min-h-[calc(100vh-64px)] items-center justify-center p-8'>
      <div className='w-full max-w-md rounded-xl bg-surface p-8 text-center'>
        {failed ? (
          <>
            <h1 className='text-2xl font-bold text-heading'>
              El enlace no es válido
            </h1>
            <p className='mt-2 text-sm text-muted'>
              El enlace expiró o ya fue usado. Volvé a registrarte para recibir
              uno nuevo.
            </p>
            <Link
              href='/register'
              className='mt-4 inline-block font-semibold text-primary hover:underline'
            >
              Volver al registro
            </Link>
          </>
        ) : (
          <>
            <h1 className='text-2xl font-bold text-heading'>
              Verificando tu correo…
            </h1>
            <p className='mt-2 text-sm text-muted'>
              Confirmamos tu cuenta. Ya podés volver a la pestaña donde
              empezaste el registro.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
