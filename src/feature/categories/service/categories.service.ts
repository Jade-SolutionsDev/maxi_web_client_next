import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toCategory } from '../adapter/category.adapter';
import type { Category, CategoryResponse } from '../type/category.interface';

export const getCategories = async (): Promise<Category[]> => {
  'use cache';

  const { data } =
    await api<ApiResponse<Paginated<CategoryResponse>>>('/public/categories');

  return data.items.map(toCategory);
};
