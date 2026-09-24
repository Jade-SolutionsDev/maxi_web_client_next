import { SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import logo from '@/assets/logoFooter.svg';
import { BrandPanel } from '@/feature/auth/components/BrandPanel';

export const metadata: Metadata = {
  title: 'Activar mi cuenta | Maxi Habana',
  robots: { index: false },
};

async function RedirectIfAuthenticated() {
  const { userId } = await auth();

  if (userId) {
    redirect('/');
  }

  return null;
}

/**
 * Donde aterriza quien recibe una invitación abierta desde el back-office.
 *
 * Aquí sí se usa el componente de Clerk y no el formulario propio del registro:
 * el enlace trae un ticket en la URL y ese componente sabe canjearlo, pedir
 * solo la contraseña y dejar la sesión iniciada. El formulario de `/register`
 * crea cuentas desde cero y no entiende de tickets, así que mandar aquí a
 * alguien invitado le haría teclear un correo que ya está decidido.
 */
export default function InvitacionPage() {
  return (
    <div className='grid min-h-[calc(100vh-64px)] lg:grid-cols-2'>
      <Suspense>
        <RedirectIfAuthenticated />
      </Suspense>
      <BrandPanel variant='register' />
      <div className='flex items-center justify-center p-8'>
        <div className='flex w-full max-w-md flex-col items-center gap-6'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <Image src={logo} alt='Maxi Habana' height={50} loading='eager' />
            <div>
              <h1 className='text-3xl font-bold text-heading'>
                Activa tu cuenta
              </h1>
              <p className='mt-2 text-sm text-muted'>
                Te abrimos una cuenta en Maxi Habana. Elige tu contraseña y
                listo.
              </p>
            </div>
          </div>

          <SignUp
            routing='hash'
            signInUrl='/login'
            fallbackRedirectUrl='/'
            appearance={{ captcha: { language: 'es-ES' } }}
          />
        </div>
      </div>
    </div>
  );
}
