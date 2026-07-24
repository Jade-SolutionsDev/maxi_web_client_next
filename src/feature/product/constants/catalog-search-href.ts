import { createSerializer } from 'nuqs/server';
import { productSearchParams, SEARCH_QUERY_KEY } from './product-search-params';

export const CATALOG_PATH = '/catalog';

/**
 * `nuqs/server` is pure (no adapter, no context, no `server-only`), so this runs
 * in a client component too. It is what lets the header search build a catalog
 * URL from any route — the nuqs hooks can only rewrite the *current* pathname.
 */
const serialize = createSerializer(productSearchParams);

/**
 * Target URL for a header search submit.
 *
 * From `/catalog` the active filters are the context of the search and are kept;
 * from anywhere else the search starts on a clean catalog.
 */
export const buildCatalogSearchHref = (
  query: string,
  pathname: string,
  current: URLSearchParams,
) => {
  const base =
    pathname === CATALOG_PATH ? `${CATALOG_PATH}?${current}` : CATALOG_PATH;

  // `null` deletes the key, `undefined` leaves it untouched: an empty submit
  // clears the search term without disturbing the other filters.
  return serialize(base, { [SEARCH_QUERY_KEY]: query.trim() || null });
};
