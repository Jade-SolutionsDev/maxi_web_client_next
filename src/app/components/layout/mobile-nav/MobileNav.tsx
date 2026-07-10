'use client';

import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { MobileNavFooter } from './MobileNavFooter';
import { MobileNavHeader } from './MobileNavHeader';
import { MobileNavList } from './MobileNavList';
import { MobileNavTrigger } from './MobileNavTrigger';

export const MobileNav = () => (
  <Sheet>
    <MobileNavTrigger />

    <SheetContent side='left' showCloseButton={false} className='gap-0 p-0'>
      <MobileNavHeader />
      <MobileNavList />
      <MobileNavFooter />
    </SheetContent>
  </Sheet>
);
