import type { ApiResponse } from '@/api/http';

/** Localized text the API returns for user-facing fields. */
export interface LocalizedText {
  en: string;
  es: string;
}

/** Raw product as returned by the API (snake_case, prices as strings). */
export interface ProductResponse {
  id: string;
  standard_image: string;
  big_image: string;
  name: LocalizedText;
  order: number;
  /** Decimal string, e.g. "1.13". */
  price: string;
  /** Decimal string, e.g. "1.13". */
  sale_price: string;
  stock: number;
  featured: boolean;
  format: string;
  measure_unit: string;
  measure_unit_amount: number;
  category_id: string;
  department_id: string;
  category: string;
  department: string;
  rating_avg: string | null;
  rating_unit: number | null;
  /** Decimal string, e.g. "0.00". */
  sale_percent: string;
  expireat: string | null;
  available: boolean;
  createdat: string; // ISO date
  acepttransfercup: boolean;
  updatedat: string; // ISO date
}

export interface ProductListResponse extends ApiResponse<ProductResponse[]> {
  total: number;
}

export interface Product {
  id: string;
  name: string;
  /** Current selling price in USD. */
  price: number;
  /** List price, only present when the product is on offer. */
  previousPrice?: number;
  /** Product image URL; absent when the API has no image for the product. */
  image?: string;
}
