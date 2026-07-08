export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Categorías', href: '/categorias' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export const contactPhone: NavItem = {
  label: '+53 5 432 6665',
  href: 'tel:+5354326665',
};
