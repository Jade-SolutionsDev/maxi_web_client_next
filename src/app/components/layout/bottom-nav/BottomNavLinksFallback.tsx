import { bottomNavItems } from '../constants/nav.constants';
import { BottomNavItem } from './BottomNavItem';

export const BottomNavLinksFallback = () => (
  <>
    {bottomNavItems.map((item) => (
      <BottomNavItem key={item.href} item={item} isActive={false} />
    ))}
  </>
);
