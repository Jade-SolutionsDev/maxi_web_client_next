import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import logo from '@/assets/logoFooter.svg';
import { BrandPanel } from '@/feature/auth/components/BrandPanel';
import { RegisterForm } from '@/feature/auth/components/RegisterForm';

export default async function RegisterPage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/');
  }

  return (
    <div className='grid min-h-[calc(100vh-64px)] lg:grid-cols-2'>
      <BrandPanel variant='register' />
      <div className='flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8 flex flex-col items-center gap-3 text-center'>
            <Image src={logo} alt='Maxi Habana' height={50} priority />

            <div>
              <h1 className='text-3xl font-bold text-heading'>Registrarse</h1>
              <p className='mt-2 text-sm text-muted'>
                ¿Ya tienes cuenta?{' '}
                <Link
                  href='/login'
                  className='font-semibold text-primary hover:underline'
                >
                  Inicia sesión
                </Link>
                .
              </p>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
