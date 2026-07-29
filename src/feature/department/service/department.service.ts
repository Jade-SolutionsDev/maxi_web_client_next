import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toDepartment } from '../adapter/department.adapter';
import type {
  Department,
  DepartmentFilters,
  DepartmentResponse,
} from '../type/department.interface';

export const getDepartments = async (
  filters: DepartmentFilters = {},
): Promise<Department[]> => {
  const { data } = await api<ApiResponse<Paginated<DepartmentResponse>>>(
    `/public/departments`,
    {
      params: {
        featured: filters.featured,
      },
    },
  );

  return data.items.map(toDepartment);
};
