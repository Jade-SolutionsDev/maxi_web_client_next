import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toDepartment } from '../adapter/department.adapter';
import type {
  Department,
  DepartmentResponse,
} from '../type/department.interface';

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await api<ApiResponse<Paginated<DepartmentResponse>>>(
    '/public/departments?featured=true',
  );

  return data.items.map(toDepartment);
};
