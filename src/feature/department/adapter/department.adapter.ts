import type {
  Department,
  DepartmentResponse,
} from '../type/department.interface';

type DepartmentSource = Pick<
  DepartmentResponse,
  'id' | 'name' | 'slug' | 'imageDesktopUrl' | 'imageMobileUrl'
>;

export const toDepartment = (department: DepartmentSource): Department => ({
  id: department.id,
  name: department.name.trim(),
  slug: department.slug,
  imageDesktop: department.imageDesktopUrl ?? undefined,
  imageMobile:
    department.imageMobileUrl ?? department.imageDesktopUrl ?? undefined,
});
