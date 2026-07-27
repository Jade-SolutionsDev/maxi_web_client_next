import { getCategories } from '@/feature/categories/service/categories.service';
import { getDepartments } from '@/feature/department/service/department.service';
import { CatalogFilters } from './filters';

export async function CatalogSidebar() {
  const [categories, departments] = await Promise.all([
    getCategories(),
    getDepartments(),
  ]);

  return (
    <CatalogFilters.Options departments={departments} categories={categories}>
      <CatalogFilters.Panel />
      <CatalogFilters.Toolbar />
    </CatalogFilters.Options>
  );
}
