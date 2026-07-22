import { parseAsBoolean, parseAsInteger, parseAsString } from 'nuqs';

export const PRICE_MIN = 0;
export const PRICE_MAX = 1000;
export const PRICE_STEP = 10;

export const productSearchParams = {
  departmentId: parseAsString,
  categoryId: parseAsString,
  featured: parseAsBoolean,
  minPrice: parseAsInteger.withDefault(PRICE_MIN),
  maxPrice: parseAsInteger.withDefault(PRICE_MAX),
};

export type CatalogSearchParams = {
  departmentId?: string;
  categoryId?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
};
