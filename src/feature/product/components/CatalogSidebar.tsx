import { getTaxonomyTree } from '@/shared/taxonomy/service/taxonomy.service';
import { CatalogFilters } from './filters';

export async function CatalogSidebar() {
  const groups = await getTaxonomyTree();

  return (
    <CatalogFilters.Options groups={groups}>
      <CatalogFilters.Panel />
      <CatalogFilters.Toolbar />
    </CatalogFilters.Options>
  );
}
