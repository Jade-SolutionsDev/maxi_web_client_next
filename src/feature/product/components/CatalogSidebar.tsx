import { getCategories } from '@/feature/categories/service/categories.service';
import { getDepartments } from '@/feature/department/service/department.service';
import { CatalogFilters } from './CatalogFilters';

export async function CatalogSidebar() {
  const [categories, departments] = await Promise.all([
    getCategories(),
    getDepartments(),
  ]);

  return <CatalogFilters departments={departments} categories={categories} />;
}
