/**
 * Raw taxonomy node as returned by the API. Department and category are the
 * SAME entity: a department is a node with `parentId = null` (root), a category
 * is a node whose `parentId` points at its department.
 */
export interface TaxonomyResponse {
  id: string;
  /** null = it is a DEPARTMENT (root). */
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageDesktopUrl: string | null;
  imageMobileUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  deletedAt: string | null;
}

export interface TaxonomyFilters {
  featured?: boolean;
  municipalityId?: string;
}

export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  /** Primary artwork; absent when the API has no image for the node. */
  image?: string;
  /** Art-direction crop for phones. Falls back to `image`. */
  imageMobile?: string;
}

export interface CatalogTaxonomyResponse {
  id: string;
  name: string;
  slug: string;
  imageDesktopUrl: string | null;
  imageMobileUrl: string | null;
  sortOrder: number;
  productsCount: number;
}

export interface CatalogDepartmentResponse extends CatalogTaxonomyResponse {
  isFeatured: boolean;
  categories: CatalogTaxonomyResponse[];
}

export interface TaxonomyNode extends Taxonomy {
  productsCount: number;
}

export interface TaxonomyGroup extends TaxonomyNode {
  categories: TaxonomyNode[];
}
