import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import logo from '@/assets/logoFooter.svg';
import { BrandPanel } from '@/feature/auth/components/BrandPanel';
import { ResetPasswordForm } from '@/feature/auth/components/ResetPasswordForm';

async function RedirectIfAuthenticated() {
  const { userId } = await auth();

  if (userId) {
    redirect('/');
  }

  return null;
}

export default function ResetPasswordPage() {
  return (
    <div className='grid min-h-[calc(100vh-64px)] lg:grid-cols-2'>
      <Suspense>
        <RedirectIfAuthenticated />
      </Suspense>
      <BrandPanel variant='reset' />
      <div className='flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8 flex flex-col items-center gap-3 text-center'>
            <Image src={logo} alt='Maxi Habana' height={50} loading='eager' />

            <div>
              <h1 className='text-3xl font-bold text-heading'>
                Recuperar contraseña
              </h1>
              <p className='mt-2 text-sm text-muted'>
                ¿Ya la recordaste?{' '}
                <Link
                  href='/login'
                  className='font-semibold text-primary hover:underline'
                >
                  Iniciar sesión
                </Link>
                .
              </p>
            </div>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
