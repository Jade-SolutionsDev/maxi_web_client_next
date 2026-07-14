import type {
  Department,
  DepartmentResponse,
  DepartmentWithArtwork,
} from '../type/department.interface';

export const hasArtwork = (
  department: DepartmentResponse,
): department is DepartmentWithArtwork => department.imageDesktopUrl !== null;

export const toDepartment = (
  department: DepartmentWithArtwork,
): Department => ({
  id: department.id,
  name: department.name.trim(),
  slug: department.slug,
  imageDesktop: department.imageDesktopUrl,
  imageMobile: department.imageMobileUrl ?? department.imageDesktopUrl,
});
