import { parseAsBoolean, parseAsString } from 'nuqs';

// Client-side (sidebar) parsers: nuqs writes these into the URL.
export const productSearchParams = {
  departmentId: parseAsString,
  categoryId: parseAsString,
  featured: parseAsBoolean,
};

// Server-side shape. Filters are single-select, so each value is a plain
// string — we read `searchParams` directly on the server instead of nuqs'
// loader, which breaks under `cacheComponents`.
export type CatalogSearchParams = {
  departmentId?: string;
  categoryId?: string;
  featured?: string;
};
