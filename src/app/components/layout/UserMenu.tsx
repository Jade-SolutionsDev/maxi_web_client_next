'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { getInitials } from '@/helpers';
import { useClickOutside } from '@/hooks/useClickOutside';

export const UserMenu = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  if (!isLoaded) {
    return <User className='icon' aria-hidden='true' />;
  }

  if (!isSignedIn) {
    return (
      <Link href='/login' aria-label='Iniciar sesión'>
        <User className='icon' />
      </Link>
    );
  }

  const fullName = user?.fullName ?? '';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials = getInitials(fullName) || 'U';

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-label={fullName ? `Menú de usuario, ${fullName}` : 'Menú de usuario'}
        aria-haspopup='menu'
        aria-expanded={open}
        className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80 bg-white text-sm font-bold text-primary shadow-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-10 md:w-10'
      >
        {initials}
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 z-30 mt-2 w-56 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5'
        >
          {(fullName || email) && (
            <div className='border-b border-input px-3 py-2'>
              {fullName && (
                <p className='truncate text-sm font-semibold text-heading'>
                  {fullName}
                </p>
              )}
              {email && (
                <p className='truncate text-xs text-muted'>{email}</p>
              )}
            </div>
          )}

          <button
            type='button'
            role='menuitem'
            onClick={() => signOut({ redirectUrl: '/' })}
            className='mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-surface'
          >
            <LogOut className='h-4 w-4' aria-hidden='true' />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
