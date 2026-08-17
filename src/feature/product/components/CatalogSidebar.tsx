import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getTaxonomyTree } from '@/shared/taxonomy/service/taxonomy.service';
import { CatalogFilters } from './filters';

export async function CatalogSidebar() {
  const municipalityId = await readMunicipalityId();
  const groups = await getTaxonomyTree(municipalityId ?? undefined);

  return (
    <CatalogFilters.Options groups={groups}>
      <CatalogFilters.Panel />
      <CatalogFilters.Toolbar />
    </CatalogFilters.Options>
  );
}
