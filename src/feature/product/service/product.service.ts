import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { api } from '@/api/http';
import { toProduct } from '../adapter/productAdapter';
import type { Product, ProductListResponse } from '../type/product.interface';

const FEATURED_PAGE_SIZE = 15;

export const getFeaturedProducts = async (): Promise<Product[]> => {
  'use cache';

  cacheLife('hours');
  cacheTag('products');

  const { data } = await api<ProductListResponse>('product/available/web', {
    base: 'old',
    params: { page: 1, size: FEATURED_PAGE_SIZE, featured: true },
  });

  return data.map(toProduct);
};
