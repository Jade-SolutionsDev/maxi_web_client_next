'use client';

import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { SignOutConfirmDialog } from '../SignOutConfirmDialog';
import { useSignOutConfirm } from '../useSignOutConfirm';
import { MobileNavFooter } from './MobileNavFooter';
import { MobileNavHeader } from './MobileNavHeader';
import { MobileNavList } from './MobileNavList';
import { MobileNavTrigger } from './MobileNavTrigger';

const sheetContentClass =
  'mb-[var(--bottom-nav-height)] max-h-[75svh] gap-0 overflow-hidden p-0';

export const MobileNav = ({ phone }: { phone: string }) => {
  const signOutConfirm = useSignOutConfirm();

  return (
    <>
      <Sheet>
        <MobileNavTrigger />

        <SheetContent
          side='bottom'
          showCloseButton={false}
          className={sheetContentClass}
        >
          <MobileNavHeader />
          <MobileNavList />
          <MobileNavFooter phone={phone} onSignOut={signOutConfirm.open} />
        </SheetContent>
      </Sheet>

      <SignOutConfirmDialog
        isOpen={signOutConfirm.isOpen}
        onClose={signOutConfirm.close}
      />
    </>
  );
};
