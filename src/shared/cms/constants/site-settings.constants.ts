import type { SiteSettings } from '../type/cms.interface';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  footer: {
    blurb:
      'Del mercado a tu mesa, sin complicaciones. Productos frescos y de confianza, con entrega rápida en toda La Habana.',
    copyright: '© 2026 Maxi. Todos los derechos reservados.',
    legalLinks: [
      { label: 'Política de privacidad', slug: 'politica-de-privacidad' },
      { label: 'Términos y condiciones', slug: 'terminos-y-condiciones' },
    ],
  },
  contact: {
    email: 'comercialmaxihabana@gmail.com',
    phone: '+53 5 432 6665',
    hours: '24 horas',
  },
  payments: {
    visa: true,
    mastercard: true,
    mibilletera: false,
    tropipay: true,
  },
  services: {
    heading: 'Nuestros servicios',
    subheading:
      'Cuidamos cada pedido para que tu familia en La Habana reciba lo que necesita, con la mejor calidad.',
  },
};
