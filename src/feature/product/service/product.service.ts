import 'server-only';

import { api, type ApiResponse } from '@/api/http';
import { toProduct } from '../adapter/product.adapter';
import type {
  Product,
  ProductFilters,
  ProductResponse,
} from '../type/product.interface';

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<Product[]> => {
  const { data } = await api<ApiResponse<ProductResponse[]>>(
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
    }
  );

  return data.map(toProduct);
};

export const getProductById = async (uuid: string): Promise<Product> => {
  const { data } = await api<ApiResponse<ProductResponse>>(
    `/public/products/${uuid}`
  );
  return toProduct(data);
};
