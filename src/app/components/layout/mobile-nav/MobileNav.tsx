'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { SignOutConfirmDialog } from '../SignOutConfirmDialog';
import { MobileNavFooter } from './MobileNavFooter';
import { MobileNavHeader } from './MobileNavHeader';
import { MobileNavList } from './MobileNavList';
import { MobileNavTrigger } from './MobileNavTrigger';

export const MobileNav = () => {
  // The confirmation is a sibling of the sheet, not a child: tapping "Cerrar
  // sesión" closes the sheet, and a dialog inside it would unmount with it.
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  return (
    <>
      <Sheet>
        <MobileNavTrigger />

        <SheetContent side='left' showCloseButton={false} className='gap-0 p-0'>
          <MobileNavHeader />
          <MobileNavList />
          <MobileNavFooter onSignOut={() => setIsSignOutOpen(true)} />
        </SheetContent>
      </Sheet>

      <SignOutConfirmDialog
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
      />
    </>
  );
};
