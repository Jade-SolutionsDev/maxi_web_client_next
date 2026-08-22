'use client';

import { usePathname } from 'next/navigation';
import { isActiveHref } from '@/lib/utils';
import { bottomNavItems } from '../constants/nav.constants';
import { BottomNavItem } from './BottomNavItem';

export const BottomNavLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {bottomNavItems.map((item) => (
        <BottomNavItem
          key={item.href}
          item={item}
          isActive={isActiveHref(item.href, pathname)}
        />
      ))}
    </>
  );
};
