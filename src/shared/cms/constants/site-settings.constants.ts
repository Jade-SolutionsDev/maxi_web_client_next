import type { SiteSettings } from '../type/cms.interface';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // Los mismos que vivían en `constants/redes-sociales.ts`: si el backend no
  // los manda, la tienda sigue enseñando lo de siempre.
  social: [
    {
      label: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61550740714835',
    },
    { label: 'Instagram', url: 'https://www.instagram.com/maxihabana' },
  ],
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
    phone: '+53 5251 9414',
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
