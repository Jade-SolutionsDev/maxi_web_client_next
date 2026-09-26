export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  label: string;
  links: FooterLink[];
}

export const siteLinks: FooterLink[] = [
  { label: 'Catálogo', href: '/catalog' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Contacto', href: '/contacto' },
];
