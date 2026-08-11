import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type SearchParams,
} from 'nuqs/server';
import { clamp } from '@/helpers';
import type {
  ProductSortBy,
  ProductSortOrder,
} from '../type/product.interface';

export const PRICE_MIN = 0;
export const PRICE_MAX = 1000;
export const PRICE_STEP = 10;

/**
 * Page sizes offered by the catalog. Multiples of 12 fill whole rows on the
 * 2/3/4-column grid, so the last row never renders half empty.
 */
export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export const FIRST_PAGE = 1;

/** URL key for the free-text product search. Single source for client and server. */
export const SEARCH_QUERY_KEY = 'q';

export const SORT_BY_VALUES = ['name', 'finalPrice', 'createdAt'] as const;
export const SORT_ORDER_VALUES = ['asc', 'desc'] as const;

export const DEFAULT_SORT_BY: ProductSortBy = 'createdAt';
export const DEFAULT_SORT_ORDER: ProductSortOrder = 'desc';

/** Sort options for the catalog dropdown — single source for schema and UI. */
export const SORT_OPTIONS = [
  {
    value: 'createdAt:desc',
    label: 'Más reciente',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  {
    value: 'finalPrice:asc',
    label: 'Precio: menor a mayor',
    sortBy: 'finalPrice',
    sortOrder: 'asc',
  },
  {
    value: 'finalPrice:desc',
    label: 'Precio: mayor a menor',
    sortBy: 'finalPrice',
    sortOrder: 'desc',
  },
  {
    value: 'name:asc',
    label: 'Nombre A–Z',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  {
    value: 'name:desc',
    label: 'Nombre Z–A',
    sortBy: 'name',
    sortOrder: 'desc',
  },
] as const satisfies ReadonlyArray<{
  value: string;
  label: string;
  sortBy: ProductSortBy;
  sortOrder: ProductSortOrder;
}>;

export const productSearchParams = {
  [SEARCH_QUERY_KEY]: parseAsString,
  departmentId: parseAsString,
  categoryId: parseAsString,
  featured: parseAsBoolean,
  minPrice: parseAsInteger.withDefault(PRICE_MIN),
  maxPrice: parseAsInteger.withDefault(PRICE_MAX),
  sortBy: parseAsStringLiteral(SORT_BY_VALUES).withDefault(DEFAULT_SORT_BY),
  sortOrder:
    parseAsStringLiteral(SORT_ORDER_VALUES).withDefault(DEFAULT_SORT_ORDER),
  page: parseAsInteger.withDefault(FIRST_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export type CatalogSearchParams = {
  /** Free-text search over the product name. */
  q?: string;
  departmentId?: string;
  categoryId?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  sortOrder?: ProductSortOrder;
  page: number;
  limit: number;
};

const searchParamsCache = createSearchParamsCache(productSearchParams);

const isPageSize = (
  value: number,
): value is (typeof PAGE_SIZE_OPTIONS)[number] =>
  PAGE_SIZE_OPTIONS.some((option) => option === value);

export const parseCatalogSearchParams = (
  raw: SearchParams,
): CatalogSearchParams => {
  const parsed = searchParamsCache.parse(raw);

  const minPrice = clamp(parsed.minPrice, PRICE_MIN, PRICE_MAX);
  const maxPrice = clamp(parsed.maxPrice, PRICE_MIN, PRICE_MAX);
  const lowerPrice = Math.min(minPrice, maxPrice);
  const upperPrice = Math.max(minPrice, maxPrice);

  return {
    // A blank or whitespace-only `?q=` is not a filter: normalize it away so it
    // never reaches the API as an empty ILIKE.
    q: parsed.q?.trim() || undefined,
    departmentId: parsed.departmentId ?? undefined,
    categoryId: parsed.categoryId ?? undefined,
    featured: parsed.featured ?? undefined,
    minPrice: lowerPrice > PRICE_MIN ? lowerPrice : undefined,
    maxPrice: upperPrice < PRICE_MAX ? upperPrice : undefined,
    sortBy: parsed.sortBy,
    sortOrder: parsed.sortOrder,
    page: Math.max(parsed.page, FIRST_PAGE),
    // A hand-written `?limit=99999` is a request to dump the whole catalog in
    // one round trip: only the sizes the UI offers reach the API.
    limit: isPageSize(parsed.limit) ? parsed.limit : DEFAULT_PAGE_SIZE,
  };
};
