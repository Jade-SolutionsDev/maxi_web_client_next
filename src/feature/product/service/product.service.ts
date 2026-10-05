import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';
import { type ApiResponse, api, type Paginated } from '@/api/http';
import { pickByIds } from '@/helpers';
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
  ids: filters.ids?.length ? filters.ids.join(',') : undefined,
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

export const FEATURED_PRODUCTS_LIMIT = 24;

export const getFeaturedProducts = async (
  productIds: string[],
  municipalityId?: string,
): Promise<Product[]> => {
  if (!productIds.length) {
    const { items } = await getProducts({
      featured: true,
      limit: FEATURED_PRODUCTS_LIMIT,
      municipalityId,
    });
    return items;
  }

  const { items } = await getProducts({
    ids: productIds,
    limit: productIds.length,
    municipalityId,
  });
  return pickByIds(items, productIds);
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
