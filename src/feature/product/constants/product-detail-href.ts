import type { Product } from '../type/product.interface';
import { CATALOG_PATH } from './catalog-search-href';

const TRAILING_UUID =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const buildProductDetailHref = ({
  id,
  slug,
}: Pick<Product, 'id' | 'slug'>) => {
  const trimmed = slug.trim();

  return trimmed ? `${CATALOG_PATH}/${trimmed}-${id}` : `${CATALOG_PATH}/${id}`;
};

export const extractProductId = (segment: string): string | null =>
  segment.match(TRAILING_UUID)?.[0] ?? null;
