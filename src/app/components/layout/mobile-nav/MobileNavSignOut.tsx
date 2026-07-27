'use client';

import { useAuth } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { SheetClose } from '@/app/components/ui/sheet';

interface MobileNavSignOutProps {
  onSignOut: () => void;
}

/**
 * Footer action: closes the sheet and asks for confirmation. Hidden while
 * unauthenticated. The dialog itself lives in MobileNav, outside the sheet.
 */
export const MobileNavSignOut = ({ onSignOut }: MobileNavSignOutProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SheetClose
      render={
        <button
          type='button'
          onClick={onSignOut}
          className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-heading outline-none transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary/40'
        >
          <LogOut className='size-5 shrink-0 text-muted' aria-hidden='true' />
          Cerrar sesión
        </button>
      }
    />
  );
};
