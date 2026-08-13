import { createSerializer } from 'nuqs/server';
import { productSearchParams, SEARCH_QUERY_KEY } from './product-search-params';

export const CATALOG_PATH = '/catalog';

const serialize = createSerializer(productSearchParams);

export const buildCatalogSearchHref = (
  query: string,
  pathname: string,
  current: URLSearchParams,
) => {
  const base =
    pathname === CATALOG_PATH ? `${CATALOG_PATH}?${current}` : CATALOG_PATH;

  return serialize(base, {
    [SEARCH_QUERY_KEY]: query.trim() || null,
    page: null,
  });
};

export const buildCatalogPageHref = (page: number, current: URLSearchParams) =>
  serialize(`${CATALOG_PATH}?${current}`, { page });
