import {
  getCategories,
  getDepartments,
} from '@/shared/taxonomy/service/taxonomy.service';
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
