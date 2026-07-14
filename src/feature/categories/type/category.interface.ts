import type { LocalizedText } from '@/feature/product/type/product.interface';

/** Raw category as returned by the API (snake_case, localized name). */
export interface CategoryResponse {
  id: string;
  image: string;
  name: LocalizedText;
  order: number;
  available: boolean;
  department_id: string;
}

export interface CategoryListResponse {
  data: CategoryResponse[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  departmentId: string;
}
