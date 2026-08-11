import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api } from '@/api/http';
import { toDepartment } from '@/feature/department/adapter/department.adapter';
import type { Department } from '@/feature/department/type/department.interface';
import { toCategoryFromTree } from '../adapter/category.adapter';
import type {
  CatalogTreeDepartmentResponse,
  Category,
} from '../type/category.interface';

export interface CatalogTree {
  departments: Department[];
  categories: Category[];
}

export const getCatalogTree = async (): Promise<CatalogTree> => {
  'use cache';
  cacheLife('hours');
  cacheTag('taxonomy');

  const { data } =
    await api<ApiResponse<CatalogTreeDepartmentResponse[]>>('/public/catalog');

  return {
    departments: data.map(toDepartment),
    categories: data.flatMap((department) =>
      department.categories.map((category) =>
        toCategoryFromTree(department.id, category),
      ),
    ),
  };
};
