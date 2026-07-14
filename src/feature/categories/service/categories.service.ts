import { api } from '@/api/http';
import { Category, CategoryListResponse } from '../type/category.interface';
import { toCategory } from '../adapter/category.adapter';
import { cacheLife, cacheTag } from 'next/cache';

export const getCategories = async (): Promise<Category[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');

  const { data } = await api<CategoryListResponse>('category/with-products', {
    base: 'old',
  });

  return data.map(toCategory);
};
