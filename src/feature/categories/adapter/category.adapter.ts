import type { Category, CategoryResponse } from '../type/category.interface';

export const toCategory = (category: CategoryResponse): Category => ({
  id: category.id,
  name: category.name.es.trim(),
  image: category.image,
  departmentId: category.department_id,
});
