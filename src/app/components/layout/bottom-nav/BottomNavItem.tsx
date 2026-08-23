import Link from 'next/link';
import type { NavItem } from '../constants/nav.constants';
import { bottomNavIconClass, bottomNavItemClass } from './bottom-nav.styles';

interface BottomNavItemProps {
  item: NavItem;
  isActive: boolean;
}

export const BottomNavItem = ({
  item: { href, label, icon: Icon },
  isActive,
}: BottomNavItemProps) => (
  <Link
    href={href}
    aria-current={isActive ? 'page' : undefined}
    className={bottomNavItemClass(isActive)}
  >
    {Icon && <Icon className={bottomNavIconClass} aria-hidden='true' />}
    {label}
  </Link>
);
