'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { LogOut, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@/app/components/ui/menu';
import { getInitials } from '@/helpers';
import { SignOutConfirmDialog } from './SignOutConfirmDialog';
import { useSignOutConfirm } from './useSignOutConfirm';

const triggerBase =
  'flex size-9 shrink-0 items-center justify-center rounded-full md:size-10';

export const UserMenu = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const signOutConfirm = useSignOutConfirm();

  if (!isLoaded) {
    return (
      <div
        className={`${triggerBase} animate-pulse bg-white/30`}
        aria-hidden='true'
      />
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        href='/login'
        aria-label='Iniciar sesión'
        className={`${triggerBase} text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
      >
        <User className='size-6' aria-hidden='true' />
      </Link>
    );
  }

  const fullName = user?.fullName ?? '';
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials = getInitials(fullName) || 'U';

  return (
    <>
      <Menu modal={false}>
        <MenuTrigger
          aria-label={
            fullName ? `Menú de usuario, ${fullName}` : 'Menú de usuario'
          }
          className={`${triggerBase} border-2 border-white/80 bg-white text-sm font-bold text-total shadow-sm transition duration-150 hover:border-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-popup-open:border-white data-popup-open:shadow-md`}
        >
          {initials}
        </MenuTrigger>

        <MenuContent className='w-64 text-center'>
          <div className='flex flex-col items-center gap-2 px-4 pt-4 pb-3'>
            {fullName && (
              <p className='max-w-full truncate text-base leading-tight font-semibold text-heading'>
                {fullName}
              </p>
            )}

            {email && (
              <p
                className='max-w-full truncate text-sm text-muted'
                title={email}
              >
                {email}
              </p>
            )}
          </div>

          <MenuSeparator />

          <MenuItem
            onClick={() => router.push('/pedidos')}
            className='justify-center font-semibold'
          >
            <ShoppingBag className='text-muted' aria-hidden='true' />
            Mis pedidos
          </MenuItem>

          <MenuSeparator />

          <MenuItem
            onClick={signOutConfirm.open}
            className='justify-center font-semibold'
          >
            <LogOut className='text-muted' aria-hidden='true' />
            Cerrar sesión
          </MenuItem>
        </MenuContent>
      </Menu>

      <SignOutConfirmDialog
        isOpen={signOutConfirm.isOpen}
        onClose={signOutConfirm.close}
      />
    </>
  );
};
