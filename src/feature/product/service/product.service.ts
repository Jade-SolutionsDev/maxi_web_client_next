import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';
import { type ApiResponse, api, type Paginated } from '@/api/http';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { toProduct } from '../adapter/product.adapter';
import type {
  Product,
  ProductFilters,
  ProductResponse,
} from '../type/product.interface';

const toProductParams = (filters: ProductFilters) => ({
  q: filters.q,
  departmentId: filters.departmentId,
  categoryId: filters.categoryId,
  categorySlug: filters.categorySlug,
  departmentSlug: filters.departmentSlug,
  locationId: filters.locationId,
  municipalityId: filters.municipalityId,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  featured: filters.featured,
  onSale: filters.onSale,
  includeOutOfStock: filters.includeOutOfStock,
  page: filters.page,
  limit: filters.limit,
  sortBy: filters.sortBy,
  sortOrder: filters.sortOrder,
});

const toProductPage = (
  data: Paginated<ProductResponse>,
): Paginated<Product> => ({ ...data, items: data.items.map(toProduct) });

export const getProducts = async (
  filters: ProductFilters = {},
): Promise<Paginated<Product>> => {
  'use cache';
  cacheLife('minutes');
  cacheTag('product-list');

  const { data } = await api<ApiResponse<Paginated<ProductResponse>>>(
    '/public/products',
    { params: toProductParams(filters) },
  );

  return toProductPage(data);
};

export const getFreshProducts = async (
  filters: ProductFilters = {},
): Promise<Paginated<Product>> => {
  const { data } = await api<ApiResponse<Paginated<ProductResponse>>>(
    '/public/products',
    { params: toProductParams(filters), cache: 'no-store' },
  );

  return toProductPage(data);
};

export const getProductById = cache(async (uuid: string): Promise<Product> => {
  const municipalityId = (await readMunicipalityId()) ?? undefined;
  const { data } = await api<ApiResponse<ProductResponse>>(
    `/public/products/${encodeURIComponent(uuid)}`,
    { params: { municipalityId } },
  );
  return toProduct(data);
});
