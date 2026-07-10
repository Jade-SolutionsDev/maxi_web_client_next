'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SheetTrigger } from '@/app/components/ui/sheet';

export const MobileNavTrigger = () => (
  <SheetTrigger
    render={
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Abrir menú de navegación'
        className='shrink-0 rounded-lg text-white hover:bg-white/15 focus-visible:ring-white/60 md:hidden'
      />
    }
  >
    <Menu />
  </SheetTrigger>
);
