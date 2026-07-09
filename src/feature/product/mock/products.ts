import type { StaticImageData } from 'next/image';
import aceite from '@/assets/productos/aceite.webp';
import arroz from '@/assets/productos/arroz.webp';
import carne from '@/assets/productos/Carne.webp';
import cerveza from '@/assets/productos/Cerveza.webp';
import cerdo from '@/assets/productos/cerdo.webp';

export type Product = {
  id: string;
  name: string;
  /** Current price in USD. */
  price: number;
  /** Original price when the product is on offer. */
  previousPrice?: number;
  image: StaticImageData;
};

/** Mock data for the featured products section (no backend yet). */
export const featuredProducts: Product[] = [
  {
    id: 'arroz-rico-prato-1kg',
    name: 'Arroz largo Rico Prato (1 kg)',
    price: 1.13,
    image: arroz,
  },
  {
    id: 'cerveza-bucanero-caja-24',
    name: 'Cerveza Bucanero (caja 24)',
    price: 26.5,
    previousPrice: 31.0,
    image: cerveza,
  },
  {
    id: 'aceite-badelli-900ml',
    name: 'Aceite Badelli 900 ml',
    price: 2.04,
    image: aceite,
  },
  {
    id: 'carne-de-cerdo-lb',
    name: 'Carne de Cerdo (lb)',
    price: 4.45,
    image: cerdo,
  },
  {
    id: 'carne-de-res-lb',
    name: 'Carne de Res (lb)',
    price: 5.6,
    image: carne,
  },
];
