export interface DepartmentResponse {
  id: string;
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
  updatedAt: string;
}

/** A department the API returned with artwork — the only kind we render. */
export type DepartmentWithArtwork = DepartmentResponse & {
  imageDesktopUrl: string;
};

export interface Department {
  id: string;
  name: string;
  slug: string;
  imageDesktop: string;
  imageMobile: string;
}
