import { type ApiResponse, api } from '@/api/http';
import { toCategory } from '../adapter/category.adapter';
import type { Category, CategoryResponse } from '../type/category.interface';

export const getCategories = async (): Promise<Category[]> => {
  'use cache';

  const { data } =
    await api<ApiResponse<CategoryResponse[]>>('/public/categories');

  return data.map(toCategory);
};
