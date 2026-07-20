import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { api } from '@/api/http';
import { toProduct } from '../adapter/product.adapter';
import type {
  Product,
  ProductFilters,
  ProductListResponse,
} from '../type/product.interface';

export const getProducts = async (
  filters: ProductFilters = {},
): Promise<Product[]> => {
  'use cache';

  cacheLife('hours');
  cacheTag('products');

  const { data } = await api<ProductListResponse>('/public/products', {
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
  });

  return data.map(toProduct);
};
