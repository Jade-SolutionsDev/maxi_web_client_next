import { createSerializer } from 'nuqs/server';
import { productSearchParams, SEARCH_QUERY_KEY } from './product-search-params';

export const CATALOG_PATH = '/catalog';

const serialize = createSerializer(productSearchParams);

/**
 * Searching from inside the catalog keeps the filters the customer already set;
 * from anywhere else it starts clean. Like {@link buildCatalogPageHref}, it is
 * built from the filter state and not from `useSearchParams()`, which does not
 * see what nuqs writes to the URL.
 */
export const buildCatalogSearchHref = (
  query: string,
  pathname: string,
  filters: Record<string, unknown>,
) =>
  serialize(CATALOG_PATH, {
    ...(pathname === CATALOG_PATH ? filters : {}),
    [SEARCH_QUERY_KEY]: query.trim() || null,
    page: null,
  });

/**
 * Built from the filter state, not from `useSearchParams()`. nuqs writes the URL
 * through the native history API, and `useSearchParams()` does not react to it:
 * after clicking a filter the hook still returned the params the page loaded
 * with, so every page link dropped the filter the customer had just applied.
 */
export const buildCatalogPageHref = (
  page: number,
  filters: Record<string, unknown>,
) => serialize(CATALOG_PATH, { ...filters, page });
