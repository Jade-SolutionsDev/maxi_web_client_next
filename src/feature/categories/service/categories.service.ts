import { type ApiResponse, api } from '@/api/http';
import { toCategory } from '../adapter/category.adapter';
import type { Category, CategoryResponse } from '../type/category.interface';
import { cacheLife, cacheTag } from 'next/cache';

export const getCategories = async (): Promise<Category[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');

  const { data } = await api<ApiResponse<CategoryResponse[]>>(
    'category/with-products',
    { base: 'old' },
  );

  return data.map(toCategory);
};
