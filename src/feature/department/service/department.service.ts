import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api } from '@/api/http';
import { hasArtwork, toDepartment } from '../adapter/department.adapter';
import type {
  Department,
  DepartmentResponse,
} from '../type/department.interface';

export const getDepartments = async (): Promise<Department[]> => {
  'use cache';

  cacheLife('days');
  cacheTag('departments');

  const { data } = await api<ApiResponse<DepartmentResponse[]>>(
    '/public/departments',
  );

  return data.filter(hasArtwork).map(toDepartment);
};
