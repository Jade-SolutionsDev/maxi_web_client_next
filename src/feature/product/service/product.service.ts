import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { api } from '@/api/http';
import { toProduct } from '../adapter/product.adapter';
import type { Product, ProductListResponse } from '../type/product.interface';

const FEATURED_PAGE_SIZE = 15;

interface GetFeaturedProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
}

export const getFeaturedProducts = async (
  params: GetFeaturedProductsParams
): Promise<Product[]> => {
  'use cache';

  cacheLife('hours');
  cacheTag('products');

  const { data } = await api<ProductListResponse>('product/available/web', {
    base: 'old',
    params: {
      ...params,
      page: params.page || 1,
      size: params.size || FEATURED_PAGE_SIZE,
      featured: params.featured,
    },
  });

  return data.map(toProduct);
};
