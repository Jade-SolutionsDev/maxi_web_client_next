'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SheetClose } from '@/app/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { NavItem } from '../constants/nav.constants';

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
}

export const MobileNavItem = ({
  item: { href, label, icon: Icon },
  isActive,
}: MobileNavItemProps) => (
  <li>
    <SheetClose
      nativeButton={false}
      render={
        <Link
          href={href}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'relative flex items-center gap-3 rounded-xl py-3.5 pr-3 pl-4 text-[15px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40',
            isActive
              ? 'bg-surface text-accent'
              : 'text-heading hover:bg-surface/60',
          )}
        >
          <span
            aria-hidden='true'
            className={cn(
              'absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          {Icon && (
            <Icon
              className={cn(
                'size-5 shrink-0',
                isActive ? 'text-accent' : 'text-muted',
              )}
              aria-hidden='true'
            />
          )}
          <span className='flex-1'>{label}</span>
          <ChevronRight
            className='size-4 shrink-0 text-muted'
            aria-hidden='true'
          />
        </Link>
      }
    />
  </li>
);
