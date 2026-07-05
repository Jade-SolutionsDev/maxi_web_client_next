'use client';

import { useAuth } from '@clerk/nextjs';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

export const UserMenu = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
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

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-label='Menú de usuario'
        aria-haspopup='menu'
        aria-expanded={open}
      >
        <User className='h-6 w-6 cursor-pointer text-heading' />
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 z-30 mt-2 w-52 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5'
        >
          <button
            type='button'
            role='menuitem'
            onClick={() => signOut({ redirectUrl: '/' })}
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-surface'
          >
            <LogOut className='h-4 w-4' aria-hidden='true' />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
