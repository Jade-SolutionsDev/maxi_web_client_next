import type { Metadata } from 'next';
import { truncate } from '@/helpers';
import { buildProductDetailHref } from '../constants/product-detail-href';
import type { Product } from '../type/product.interface';

const DESCRIPTION_MAX = 155;

const buildDescription = ({ name, description }: Product) => {
  const own = description?.trim();

  return own
    ? truncate(own, DESCRIPTION_MAX)
    : `Comprá ${name} online en MaxiHabana con entrega a domicilio.`;
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
