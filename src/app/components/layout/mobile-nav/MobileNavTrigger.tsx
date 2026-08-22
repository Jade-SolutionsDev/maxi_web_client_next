'use client';

import { Menu } from 'lucide-react';
import { SheetTrigger } from '@/app/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  bottomNavIconClass,
  bottomNavItemClass,
} from '../bottom-nav/bottom-nav.styles';

export const MobileNavTrigger = () => (
  <SheetTrigger
    render={
      <button
        type='button'
        aria-label='Menú de navegación'
        className={cn(bottomNavItemClass(false), 'data-popup-open:text-accent')}
      >
        <Menu className={bottomNavIconClass} aria-hidden='true' />
        Menú
      </button>
    }
  />
);
