import type { StaticImageData } from 'next/image';
import mastercard from '@/assets/mastercard.svg';
import tropipay from '@/assets/tropipay.png';
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

export const siteLinks: FooterLink[] = [
  { label: 'Catálogo', href: '/catalog' },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export const paymentLogos: Record<
  keyof SiteSettings['payments'],
  PaymentMethodDisplay
> = {
  visa: { src: visa, alt: 'Visa' },
  mastercard: { src: mastercard, alt: 'Mastercard' },
  mibilletera: { src: null, alt: 'Mi Billetera' },
  tropipay: { src: tropipay, alt: 'TropiPay' },
};
