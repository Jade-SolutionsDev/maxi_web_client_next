import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import logo from '@/assets/logoFooter.svg';
import { BrandPanel } from '@/feature/auth/components/BrandPanel';
import { InvitacionForm } from '@/feature/auth/components/InvitacionForm';

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

          <div className='w-full'>
            <InvitacionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
