import type { ApiResponse } from '@/api/http';
import type { CategoryResponse } from '@/feature/categories/type/category.interface';

/** Raw product as returned by the API (camelCase, money as decimal strings). */
export interface ProductResponse {
  id: string;
  categoryId: string;
  /** Read-only relation used to derive the product's department (parent). */
  category?: CategoryResponse;
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
  /** Decimal string, e.g. "1.13" — net selling price. */
  basePrice: string;
  /** 0–100, decimal string. */
  discount: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  deletedAt: string | null;
}

export interface ProductListResponse extends ApiResponse<ProductResponse[]> {
  total?: number;
}

/** Field the product list can be ordered by. */
export type ProductSortBy = 'name' | 'price' | 'createdAt';

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
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  /** Include products with no stock. Defaults to false on the API. */
  includeOutOfStock?: boolean;
  /** Max number of results to return. */
  limit?: number;
  sortBy?: ProductSortBy;
  sortOrder?: ProductSortOrder;
}

export interface Product {
  id: string;
  name: string;
  /** Net selling price in USD. */
  price: number;
  /** List price, only present when the product is on offer. */
  previousPrice?: number;
  /** Product image URL; absent when the API has no image for the product. */
  image?: string;
}
