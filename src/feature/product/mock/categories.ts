import type { StaticImageData } from 'next/image';
import bebidas from '@/assets/category/Bebidas.webp';
import carnicos from '@/assets/category/carnicos.webp';
import cervezas from '@/assets/category/cervezas.webp';
import limpieza from '@/assets/category/Productos_limpieza.webp';
import pastas from '@/assets/category/pastas.webp';
import salsas from '@/assets/category/Salsas.webp';

export type Category = {
  id: string;
  name: string;
  href: string;
  productCount: number;
  image: StaticImageData;
};

export const categories: Category[] = [
  {
    id: 'carnicos-y-pollo',
    name: 'Cárnicos y pollo',
    href: '/categorias/carnicos-y-pollo',
    productCount: 48,
    image: carnicos,
  },
  {
    id: 'cervezas',
    name: 'Cervezas',
    href: '/categorias/cervezas',
    productCount: 32,
    image: cervezas,
  },
  {
    id: 'pastas',
    name: 'Pastas',
    href: '/categorias/pastas',
    productCount: 27,
    image: pastas,
  },
  {
    id: 'aguas-y-refrescos',
    name: 'Aguas y refrescos',
    href: '/categorias/aguas-y-refrescos',
    productCount: 19,
    image: bebidas,
  },
  {
    id: 'limpieza-y-hogar',
    name: 'Limpieza y hogar',
    href: '/categorias/limpieza-y-hogar',
    productCount: 54,
    image: limpieza,
  },
  {
    id: 'salsas',
    name: 'Salsas',
    href: '/categorias/salsas',
    productCount: 21,
    image: salsas,
  },
];
