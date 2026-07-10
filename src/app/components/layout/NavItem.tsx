'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, isActiveHref } from '@/lib/utils';
import type { NavItem as NavItemData } from './constants/nav.constants';

export const NavItem = ({ label, href }: NavItemData) => {
  const pathname = usePathname();
  const isActive = isActiveHref(href, pathname);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'rounded-sm text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
        isActive
          ? 'text-white underline underline-offset-8 decoration-2'
          : 'text-white/90 hover:text-white',
      )}
    >
      {label}
    </Link>
  );
};
