import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server';
import type {
  ProductSortBy,
  ProductSortOrder,
} from '../type/product.interface';

export const PRICE_MIN = 0;
export const PRICE_MAX = 1000;
export const PRICE_STEP = 10;

export const SORT_BY_VALUES = ['name', 'price', 'createdAt'] as const;
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
    value: 'price:asc',
    label: 'Precio: menor a mayor',
    sortBy: 'price',
    sortOrder: 'asc',
  },
  {
    value: 'price:desc',
    label: 'Precio: mayor a menor',
    sortBy: 'price',
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
  departmentId: parseAsString,
  categoryId: parseAsString,
  featured: parseAsBoolean,
  minPrice: parseAsInteger.withDefault(PRICE_MIN),
  maxPrice: parseAsInteger.withDefault(PRICE_MAX),
  sortBy: parseAsStringLiteral(SORT_BY_VALUES).withDefault(DEFAULT_SORT_BY),
  sortOrder:
    parseAsStringLiteral(SORT_ORDER_VALUES).withDefault(DEFAULT_SORT_ORDER),
};

export type CatalogSearchParams = {
  departmentId?: string;
  categoryId?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  sortOrder?: ProductSortOrder;
};
