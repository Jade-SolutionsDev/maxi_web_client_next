import type { Taxonomy, TaxonomyResponse } from '../type/taxonomy.interface';

export const toTaxonomy = (taxonomy: TaxonomyResponse): Taxonomy => ({
  id: taxonomy.id,
  name: taxonomy.name.trim(),
  image: taxonomy.imageDesktopUrl ?? undefined,
  imageMobile: taxonomy.imageMobileUrl ?? taxonomy.imageDesktopUrl ?? undefined,
});
