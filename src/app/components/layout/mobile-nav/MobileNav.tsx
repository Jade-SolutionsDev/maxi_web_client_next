'use client';

import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { SignOutConfirmDialog } from '../SignOutConfirmDialog';
import { useSignOutConfirm } from '../useSignOutConfirm';
import { MobileNavFooter } from './MobileNavFooter';
import { MobileNavHeader } from './MobileNavHeader';
import { MobileNavList } from './MobileNavList';
import { MobileNavTrigger } from './MobileNavTrigger';

export const MobileNav = () => {
  const signOutConfirm = useSignOutConfirm();

  return (
    <>
      <Sheet>
        <MobileNavTrigger />

        <SheetContent side='left' showCloseButton={false} className='gap-0 p-0'>
          <MobileNavHeader />
          <MobileNavList />
          <MobileNavFooter onSignOut={signOutConfirm.open} />
        </SheetContent>
      </Sheet>

      <SignOutConfirmDialog
        isOpen={signOutConfirm.isOpen}
        onClose={signOutConfirm.close}
      />
    </>
  );
};
