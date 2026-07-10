'use client';

import { useAuth } from '@clerk/nextjs';
import { ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { SheetClose } from '@/app/components/ui/sheet';

export const MobileNavAccount = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <SheetClose
      nativeButton={false}
      render={
        <Link
          href='/login'
          className='flex items-center gap-3 rounded-xl bg-white/10 p-3 text-left outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60'
        >
          <span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15'>
            <User className='size-5 text-white' aria-hidden='true' />
          </span>
          <span className='min-w-0 flex-1'>
            <span className='block text-sm font-bold text-white'>
              Iniciá sesión
            </span>
            <span className='block truncate text-xs text-white/80'>
              Accedé a tus pedidos y ofertas
            </span>
          </span>
          <ChevronRight
            className='size-4 shrink-0 text-white/80'
            aria-hidden='true'
          />
        </Link>
      }
    />
  );
};
