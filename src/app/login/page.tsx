import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import logo from '@/assets/logoFooter.svg';
import { BrandPanel } from '@/feature/auth/components/BrandPanel';
import { LoginForm } from '@/feature/auth/components/LoginForm';

async function RedirectIfAuthenticated() {
  const { userId } = await auth();

  if (userId) {
    redirect('/');
  }

  return null;
}

export default function LoginPage() {
  return (
    <div className='grid min-h-[calc(100vh-64px)] lg:grid-cols-2'>
      <Suspense>
        <RedirectIfAuthenticated />
      </Suspense>
      <BrandPanel variant='login' />
      <div className='flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8 flex flex-col items-center gap-3 text-center'>
            <Image src={logo} alt='Maxi Habana' height={50} loading='eager' />

            <div>
              <h1 className='text-3xl font-bold text-heading'>
                Iniciar sesión
              </h1>
              <p className='mt-2 text-sm text-muted'>
                ¿No tienes una cuenta?{' '}
                <Link
                  href='/register'
                  className='font-semibold text-primary hover:underline'
                >
                  Regístrate
                </Link>
                .
              </p>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
