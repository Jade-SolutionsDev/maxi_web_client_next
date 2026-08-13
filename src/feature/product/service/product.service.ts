import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
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
): Promise<Paginated<Product>> => {
  'use cache';
  cacheLife('minutes');
  cacheTag('product-list', Object.values(filters).join('-'));

  const { data } = await api<ApiResponse<Paginated<ProductResponse>>>(
    '/public/products',
    {
      params: {
        q: filters.q,
        departmentId: filters.departmentId,
        categoryId: filters.categoryId,
        locationId: filters.locationId,
        municipalityId: filters.municipalityId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        featured: filters.featured,
        includeOutOfStock: filters.includeOutOfStock,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      },
    },
  );

  return { ...data, items: data.items.map(toProduct) };
};

export const getProductById = cache(async (uuid: string): Promise<Product> => {
  const { data } = await api<ApiResponse<ProductResponse>>(
    `/public/products/${encodeURIComponent(uuid)}`,
  );
  return toProduct(data);
});
