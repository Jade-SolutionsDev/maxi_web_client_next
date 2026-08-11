import type {
  CatalogTreeCategoryResponse,
  Category,
  CategoryResponse,
} from '../type/category.interface';

export const toCategory = (category: CategoryResponse): Category => ({
  id: category.id,
  name: category.name.trim(),
  image: category.imageDesktopUrl ?? undefined,
  departmentId: category.parentId ?? '',
});

export const toCategoryFromTree = (
  departmentId: string,
  category: CatalogTreeCategoryResponse,
): Category => ({
  id: category.id,
  name: category.name.trim(),
  image: category.imageDesktopUrl ?? undefined,
  departmentId,
});
