import { getCatalogTree } from '@/feature/categories/service/catalog.service';
import { CatalogFilters } from './filters';

export async function CatalogSidebar() {
  const { departments, categories } = await getCatalogTree();

  return (
    <CatalogFilters.Options departments={departments} categories={categories}>
      <CatalogFilters.Panel />
      <CatalogFilters.Toolbar />
    </CatalogFilters.Options>
  );
}
