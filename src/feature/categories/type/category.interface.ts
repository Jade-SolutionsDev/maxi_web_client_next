/**
 * Raw category as returned by the API. Department and category are the SAME
 * entity: a department is a `Category` with `parentId = null` (root), a
 * category is a `Category` with `parentId` pointing at its department.
 */
export interface CategoryResponse {
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

/** A category the API returned with artwork — the only kind we render. */
export type CategoryWithArtwork = CategoryResponse & {
  imageDesktopUrl: string;
};

export interface Category {
  id: string;
  name: string;
  /** Category image URL; absent when the API has no artwork for the category. */
  image?: string;
  departmentId: string;
}
