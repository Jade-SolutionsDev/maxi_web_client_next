import type {
  Department,
  DepartmentResponse,
} from '../type/department.interface';

export const toDepartment = (department: DepartmentResponse): Department => ({
  id: department.id,
  name: department.name.trim(),
  slug: department.slug,
  imageDesktop: department.imageDesktopUrl ?? undefined,
  imageMobile:
    department.imageMobileUrl ?? department.imageDesktopUrl ?? undefined,
});
