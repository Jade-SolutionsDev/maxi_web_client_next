import 'server-only';

import { cache } from 'react';
import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toProduct } from '../adapter/product.adapter';
import type {
  Product,
  ProductFilters,
  ProductResponse,
} from '../type/product.interface';

export const getProducts = async (
  filters: ProductFilters = {},
): Promise<Product[]> => {
  const { data } = await api<ApiResponse<Paginated<ProductResponse>>>(
    '/public/products',
    {
      params: {
        q: filters.q,
        departmentId: filters.departmentId,
        categoryId: filters.categoryId,
        locationId: filters.locationId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        featured: filters.featured,
        includeOutOfStock: filters.includeOutOfStock,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        
      },
    },
  );

  return data.items.map(toProduct);
};

/**
 * Memoized per request: the detail route needs the product twice, once in
 * `generateMetadata` and once to render. `cache` keeps that at one HTTP call.
 */
export const getProductById = cache(async (uuid: string): Promise<Product> => {
  const { data } = await api<ApiResponse<ProductResponse>>(
    `/public/products/${encodeURIComponent(uuid)}`,
  );
  return toProduct(data);
});
