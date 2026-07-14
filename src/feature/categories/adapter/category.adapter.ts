import type { Category, CategoryResponse } from '../type/category.interface';

export const toCategory = (category: CategoryResponse): Category => ({
  id: category.id,
  name: category.name.en.trim(),
  image: category.image,
  departmentId: category.department_id,
});
