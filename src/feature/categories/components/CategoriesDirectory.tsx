import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Container } from '@/app/components/layout/Container';
import { CATALOG_PATH } from '@/feature/product/constants/catalog-search-href';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getTaxonomyTree } from '@/shared/taxonomy/service/taxonomy.service';
import { withCategories } from '../lib/filter-taxonomy';
import { CategoriesDirectoryView } from './CategoriesDirectoryView';

export async function CategoriesDirectory() {
  const municipalityId = await readMunicipalityId();
  const tree = await getTaxonomyTree(municipalityId ?? undefined);
  const groups = withCategories(tree);

  if (groups.length === 0) {
    return (
      <Container className='py-12'>
        <EmptyState
          title='Todavía no hay categorías'
          description='Estamos organizando el catálogo en categorías para que encuentres todo más rápido.'
          action={{ href: CATALOG_PATH, label: 'Explorar productos' }}
        />
      </Container>
    );
  }

  return <CategoriesDirectoryView groups={groups} />;
}
