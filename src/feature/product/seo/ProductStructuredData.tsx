import { CURRENCY_CODE } from '@/lib/currency';
import { absoluteUrl } from '@/shared/seo/site-url';
import { buildProductDetailHref } from '../constants/product-detail-href';
import type { Product } from '../type/product.interface';

const BRAND_NAME = 'MaxiHabana';
const IN_STOCK = 'https://schema.org/InStock';
const OUT_OF_STOCK = 'https://schema.org/OutOfStock';

const buildProductLd = (product: Product) => {
  const canonical = absoluteUrl(buildProductDetailHref(product));
  const price = product.price.toFixed(2);
  const isAvailable = product.available > 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description && { description: product.description }),
    ...(product.image && { image: [product.image] }),
    sku: product.id,
    ...(product.category && { category: product.category }),
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: canonical,
      price,
      priceCurrency: CURRENCY_CODE,
      availability: isAvailable ? IN_STOCK : OUT_OF_STOCK,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    },
  };
};

type ProductStructuredDataProps = {
  product: Product;
};

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildProductLd(product)),
      }}
    />
  );
}
