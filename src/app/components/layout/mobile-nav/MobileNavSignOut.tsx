'use client';

import { useAuth } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { SheetClose } from '@/app/components/ui/sheet';

/** Footer action: signs the user out. Hidden while unauthenticated. */
export const MobileNavSignOut = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SheetClose
      render={
        <button
          type='button'
          onClick={() => signOut({ redirectUrl: '/' })}
          className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-heading outline-none transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary/40'
        >
          <LogOut className='size-5 shrink-0 text-muted' aria-hidden='true' />
          Cerrar sesión
        </button>
      }
    />
  );
};
