import mastercard from '@/assets/mastercard.svg';
import visa from '@/assets/visa.svg';

export const columns = [
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

export const paymentMethods = [
  { src: visa, alt: 'Visa' },
  { src: mastercard, alt: 'Mastercard' },
];
