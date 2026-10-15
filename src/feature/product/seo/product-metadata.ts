import type { Metadata } from 'next';
import { truncate } from '@/helpers';
import { buildProductDetailHref } from '../constants/product-detail-href';
import type { Product } from '../type/product.interface';

const DESCRIPTION_MAX = 155;

const buildDescription = ({ name, description }: Product) => {
  const own = description?.trim();

  /**
   * Sin método de entrega. Esta frase sale en los resultados de búsqueda de
   * cada producto al que le falte descripción, y prometía **entrega a
   * domicilio** cuando hoy no hay ninguna opción de reparto activa: una
   * promesa que la tienda no puede cumplir, y a la vista de cualquiera.
   *
   * Tampoco se promete recogida: así sirve igual el día que haya reparto, sin
   * tener que volver aquí. Que el negocio llame «la tienda» al sitio donde se
   * recoge no cambia nada de esto: una descripción de producto no es el lugar
   * para prometer una forma de entrega concreta.
   */
  return own
    ? truncate(own, DESCRIPTION_MAX)
    : `Compra ${name} en MaxiHabana, tu tienda en línea en Cuba.`;
};

export const buildProductMetadata = (product: Product): Metadata => {
  const canonical = buildProductDetailHref(product);
  const description = buildDescription(product);

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: canonical,
      ...(product.image && {
        images: [{ url: product.image, alt: product.name }],
      }),
    },
  };
};
