import { parseAsBoolean, parseAsString } from 'nuqs';

export const productSearchParams = {
  departmentId: parseAsString,
  categoryId: parseAsString,
  featured: parseAsBoolean,
};

export type CatalogSearchParams = {
  departmentId?: string;
  categoryId?: string;
  featured?: boolean;
};
