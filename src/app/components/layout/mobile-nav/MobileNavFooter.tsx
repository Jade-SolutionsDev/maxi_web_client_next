'use client';

import { Phone } from 'lucide-react';
import { SheetFooter } from '@/app/components/ui/sheet';
import { contactPhone } from '../constants/nav.constants';
import { MobileNavSignOut } from './MobileNavSignOut';

export const MobileNavFooter = () => (
  <SheetFooter className='gap-3 border-t border-heading/10 p-4'>
    <MobileNavSignOut />
    <a
      href={contactPhone.href}
      className='flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary/40'
    >
      <Phone className='size-4 shrink-0' aria-hidden='true' />
      {contactPhone.label}
    </a>
  </SheetFooter>
);
