import type { LucideIcon } from 'lucide-react';
import { CircleHelp, House, Info, LayoutGrid, Mail, Tags } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  /** Only rendered by the mobile drawer; the desktop bar is text-only. */
  icon?: LucideIcon;
}

export const FAQ_HREF = '/preguntas-frecuentes';

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '/', icon: House },
  { label: 'Catálogo', href: '/catalog', icon: LayoutGrid },
  { label: 'Categorías', href: '/categorias', icon: Tags },
  {
    label: 'Preguntas frecuentes',
    href: '/preguntas-frecuentes',
    icon: CircleHelp,
  },
  { label: 'Sobre nosotros', href: '/sobre-nosotros', icon: Info },
  { label: 'Contacto', href: '/contacto', icon: Mail },
];

/**
 * The FAQ link only exists while there is something to read: a category with
 * no published questions is not shown, so a store with no published questions
 * has no FAQ entry at all. Server components decide `showFaq` with
 * `hasFaqContent()` and pass it down.
 */
export const visibleNavItems = (
  items: NavItem[],
  { showFaq }: { showFaq: boolean },
): NavItem[] => (showFaq ? items : items.filter((i) => i.href !== FAQ_HREF));

const bottomNavHrefs = ['/', '/catalog'];

export const bottomNavItems = bottomNavHrefs
  .map((href) => navItems.find((item) => item.href === href))
  .filter((item) => item !== undefined);

export const sheetNavItems = navItems.filter(
  (item) => !bottomNavHrefs.includes(item.href),
);
