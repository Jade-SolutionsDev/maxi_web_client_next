import type { StaticImageData } from 'next/image';
import mastercard from '@/assets/mastercard.svg';
import visa from '@/assets/visa.svg';
import type { SiteSettings } from '@/shared/cms/type/cms.interface';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  label: string;
  links: FooterLink[];
}

export interface PaymentMethodDisplay {
  src: StaticImageData | null;
  alt: string;
}

export const columns: FooterColumn[] = [
  {
    title: 'Producto',
    label: 'Producto',
    links: [
      { label: 'Lo más destacado', href: '/catalog?featured=true' },
      { label: 'En oferta', href: '/catalog?onSale=true' },
    ],
  },
  {
    title: 'Servicio al cliente',
    label: 'Servicio al cliente',
    links: [
      { label: 'Contáctenos', href: '/contacto' },
      { label: 'Métodos de Pago', href: '/paginas/metodos-de-pago' },
    ],
  },
  {
    title: 'Mi Cuenta',
    label: 'Mi Cuenta',
    links: [
      { label: 'Iniciar sesión', href: '/login' },
      { label: 'Historial de pedidos', href: '/pedidos' },
    ],
  },
];

export const paymentLogos: Record<
  keyof SiteSettings['payments'],
  PaymentMethodDisplay
> = {
  visa: { src: visa, alt: 'Visa' },
  mastercard: { src: mastercard, alt: 'Mastercard' },
  mibilletera: { src: null, alt: 'Mi Billetera' },
};
