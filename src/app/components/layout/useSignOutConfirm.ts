'use client';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export const useSignOutConfirm = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen && isLoaded && !isSignedIn) {
    setIsOpen(false);
  }

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};
