import type { StaticImageData } from 'next/image';
import mastercard from '@/assets/mastercard.svg';
import visa from '@/assets/visa.svg';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  label: string;
  links: FooterLink[];
}

export interface PaymentMethod {
  src: StaticImageData;
  alt: string;
}

export const columns: FooterColumn[] = [
  {
    title: 'Producto',
    label: 'Producto',
    links: [
      { label: 'Lo más destacado', href: '#' },
      { label: 'En oferta', href: '#' },
    ],
  },
  {
    title: 'Servicio al cliente',
    label: 'Servicio al cliente',
    links: [
      { label: 'Contáctenos', href: '#' },
      { label: 'Métodos de Pago', href: '#' },
    ],
  },
  {
    title: 'Mi Cuenta',
    label: 'Mi Cuenta',
    links: [
      { label: 'Iniciar sesión', href: '/login' },
      { label: 'Historial de pedidos', href: '#' },
    ],
  },
];

export const paymentMethods: PaymentMethod[] = [
  { src: visa, alt: 'Visa' },
  { src: mastercard, alt: 'Mastercard' },
];
