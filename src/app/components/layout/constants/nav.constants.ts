import type { LucideIcon } from 'lucide-react';
import { House, Info, LayoutGrid, Mail, Tags } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  /** Only rendered by the mobile drawer; the desktop bar is text-only. */
  icon?: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '/', icon: House },
  { label: 'Catálogo', href: '/catalog', icon: LayoutGrid },
  { label: 'Categorías', href: '/categorias', icon: Tags },
  { label: 'Sobre nosotros', href: '/sobre-nosotros', icon: Info },
  { label: 'Contacto', href: '/contacto', icon: Mail },
];

export const contactPhone: NavItem = {
  label: '+53 5 432 6665',
  href: 'tel:+5354326665',
};
