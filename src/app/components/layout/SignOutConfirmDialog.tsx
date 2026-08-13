'use client';

import { useAuth } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';

interface SignOutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Single sign-out confirmation shared by the header menu and the mobile nav.
 * Render it OUTSIDE the menu or sheet that triggers it: those unmount their
 * children when they close, and the dialog would go with them.
 */
export const SignOutConfirmDialog = ({
  isOpen,
  onClose,
}: SignOutConfirmDialogProps) => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);


  if (isSigningOut && isLoaded && !isSignedIn) {
    setIsSigningOut(false);
  }

  const handleConfirm = () => {
    setIsSigningOut(true);
    signOut({ redirectUrl: '/' });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      variant='warning'
      icon={LogOut}
      title='¿Cerrar sesión?'
      description='Vas a salir de tu cuenta. Tenés que iniciar sesión de nuevo para ver tus pedidos.'
      submitText={isSigningOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
      isLoading={isSigningOut}
    />
  );
};
