'use client';

import { usePathname } from 'next/navigation';
import { isActiveHref } from '@/lib/utils';
import { navItems } from '../constants/nav.constants';
import { MobileNavItem } from './MobileNavItem';

export const MobileNavList = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label='Navegación principal'
      className='flex-1 overflow-y-auto p-3'
    >
      <ul className='flex flex-col gap-1'>
        {navItems.map((item) => (
          <MobileNavItem
            key={item.href}
            item={item}
            isActive={isActiveHref(item.href, pathname)}
          />
        ))}
      </ul>
    </nav>
  );
};
