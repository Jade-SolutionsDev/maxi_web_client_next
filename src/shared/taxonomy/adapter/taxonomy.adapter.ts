import type {
  CatalogDepartmentResponse,
  CatalogTaxonomyResponse,
  Taxonomy,
  TaxonomyGroup,
  TaxonomyNode,
  TaxonomyResponse,
} from '../type/taxonomy.interface';

type TaxonomyImageSource = Pick<
  TaxonomyResponse,
  'id' | 'name' | 'imageDesktopUrl' | 'imageMobileUrl'
>;

const toTaxonomyBase = (taxonomy: TaxonomyImageSource): Taxonomy => ({
  id: taxonomy.id,
  name: taxonomy.name.trim(),
  image: taxonomy.imageDesktopUrl ?? undefined,
  imageMobile: taxonomy.imageMobileUrl ?? taxonomy.imageDesktopUrl ?? undefined,
});

export const toTaxonomy = (taxonomy: TaxonomyResponse): Taxonomy =>
  toTaxonomyBase(taxonomy);

export const toTaxonomyNode = (
  taxonomy: CatalogTaxonomyResponse,
): TaxonomyNode => ({
  ...toTaxonomyBase(taxonomy),
  productsCount: taxonomy.productsCount,
});

export const toTaxonomyGroup = (
  department: CatalogDepartmentResponse,
): TaxonomyGroup => ({
  ...toTaxonomyNode(department),
  categories: department.categories.map(toTaxonomyNode),
});
