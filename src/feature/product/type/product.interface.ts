import type { TaxonomyResponse } from '@/shared/taxonomy/type/taxonomy.interface';

/** Raw product as returned by the API (camelCase, money as decimal strings). */
export interface ProductResponse {
  id: string;
  categoryId: string;
  /** Read-only relation used to derive the product's department (parent). */
  category?: TaxonomyResponse;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  /** Nullable until the file server is configured. */
  imageUrl: string | null;
  /** e.g. "Bolsa 1 kg", "Botella 900 ml". */
  format: string | null;
  expiryDate: string | null;
  /** 'unidad' | 'kg' | 'g' | 'L' | 'ml'... */
  measureUnit: string;
  available: number;
  basePrice: number;
  /** 0–100, numeric. */
  discount: number;
  isFeatured: boolean;
  finalPrice: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  deletedAt: string | null;
}

/** Field the product list can be ordered by. */
export type ProductSortBy = 'name' | 'finalPrice' | 'createdAt';

/** Sort direction for `sortBy`. */
export type ProductSortOrder = 'asc' | 'desc';

/** Query params for `GET /products`. */
export interface ProductFilters {
  /** Name search (ILIKE %q%). */
  q?: string;
  /** Products whose category hangs off this department. */
  departmentId?: string;
  /** Exact category match. */
  categoryId?: string;
  /** Stock for this warehouse; when omitted, total stock is used. */
  locationId?: string;
  municipalityId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  /** Include products with no stock. Defaults to false on the API. */
  includeOutOfStock?: boolean;
  /** 1-based page to return. Defaults to the first page on the API. */
  page?: number;
  /** Max number of results to return. */
  limit?: number;
  sortBy?: ProductSortBy;
  sortOrder?: ProductSortOrder;
}

export interface Product {
  id: string;
  /** URL-safe name owned by the API; used to build the detail page path. */
  slug: string;
  name: string;
  price: number;
  measureUnit: string;
  format?: string;
  discount?: number;
  image?: string;
  available: number;
  description?: string;
  /** Category name only; absent when the API omits the relation (e.g. lists). */
  category?: string;
}
