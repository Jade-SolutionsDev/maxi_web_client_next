'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { SheetClose } from '@/app/components/ui/sheet';

const ctaClass =
  'flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40';

export const MobileNavAccount = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div className='flex flex-col gap-3 rounded-2xl bg-surface p-4'>
      <p className='text-sm font-medium text-heading'>
        Inicia sesión para ver tus pedidos y direcciones
      </p>

      <div className='flex gap-2'>
        <SheetClose
          nativeButton={false}
          render={
            <Link
              href='/login'
              className={`${ctaClass} bg-primary text-white hover:brightness-95`}
            >
              Iniciar sesión
            </Link>
          }
        />
        <SheetClose
          nativeButton={false}
          render={
            <Link
              href='/register'
              className={`${ctaClass} border-2 border-primary bg-white text-accent hover:bg-surface`}
            >
              Registrarse
            </Link>
          }
        />
      </div>
    </div>
  );
};
