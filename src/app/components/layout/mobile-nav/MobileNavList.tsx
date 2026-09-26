'use client';

import { usePathname } from 'next/navigation';
import { isActiveHref } from '@/lib/utils';
import { sheetNavItems, visibleNavItems } from '../constants/nav.constants';
import { MobileNavItem } from './MobileNavItem';

export const MobileNavList = ({ showFaq }: { showFaq: boolean }) => {
  const pathname = usePathname();
  const items = visibleNavItems(sheetNavItems, { showFaq });

  return (
    <nav aria-label='Más secciones' className='flex-1 overflow-y-auto p-3'>
      <ul className='flex flex-col gap-1'>
        {items.map((item) => (
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
