'use client';

import { ChevronDown, LogIn, User, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div ref={containerRef} className='relative '>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup='menu'
        aria-expanded={open}
        aria-label='Menú de usuario'
        className='flex items-center gap-1 text-white'
      >
        <User className='icon' />
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden='true'
        />
      </button>

      <div
        role='menu'
        aria-hidden={!open}
        className={cn(
          'absolute left-1/2 top-full mt-3 min-w-56 origin-top -translate-x-1/2 rounded-2xl border border-black/5 bg-white p-2 shadow-lg transition duration-200 ease-out',
          open
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        <button
          type='button'
          role='menuitem'
          tabIndex={open ? 0 : -1}
          className='flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-2.5 font-semibold text-white transition-colors hover:bg-secondary'
        >
          <LogIn className='h-5 w-5' aria-hidden='true' />
          Iniciar sesión
        </button>

        <div className='my-2 border-t border-black/5' />

        <button
          type='button'
          role='menuitem'
          tabIndex={open ? 0 : -1}
          className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-heading transition-colors hover:bg-surface'
        >
          <UserPlus className='h-5 w-5 text-muted' aria-hidden='true' />
          Registrarse
        </button>
      </div>
    </div>
  );
};
