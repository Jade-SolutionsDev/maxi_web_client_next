import { getCategories } from '@/feature/categories/service/categories.service';
import { getDepartments } from '@/feature/department/service/department.service';
import { SideBarFilter } from './SideBarFilter';

export async function CatalogSidebar() {
  const [categories, departments] = await Promise.all([
    getCategories(),
    getDepartments(),
  ]);

  return <SideBarFilter departments={departments} categories={categories} />;
}
