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
  deletedAt: string | null;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  /** Department image URL; absent when the API has no artwork for it. */
  imageDesktop?: string;
  /** Falls back to the desktop image; absent when neither exists. */
  imageMobile?: string;
}
