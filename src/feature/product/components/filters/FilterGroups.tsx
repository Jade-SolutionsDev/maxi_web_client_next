'use client';

import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import type { Category } from '@/feature/categories/type/category.interface';
import type { Department } from '@/feature/department/type/department.interface';
import { cn } from '@/lib/utils';
import { useProductFilter } from '../../filters/catalog.filter';
import { PriceFilter } from './PriceFilter';

interface FilterGroupsProps {
  departments: Department[];
  categories: Category[];
}

/**
 * Pure filter controls (price, departments, categories, featured). Owns no
 * chrome — the surrounding card (desktop) or sheet (mobile) provides layout.
 */
export const FilterGroups = ({
  departments,
  categories,
}: FilterGroupsProps) => {
  const {
    filters,
    handleCategoryFilter,
    handleDepartmentFilter,
    handleFeaturedProduct,
    isPending,
  } = useProductFilter();

  return (
    <div className='flex flex-col gap-6'>
      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>Precio</h3>
        <PriceFilter />
      </section>

      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>
          Departamentos
        </h3>
        <ul className='mt-4 flex flex-col gap-2'>
          {departments.map((department) => (
            <li key={department.id} className='flex items-center gap-2.5'>
              <Checkbox
                id={`department-${department.id}`}
                checked={filters.departmentId === department.id}
                onCheckedChange={() => handleDepartmentFilter(department.id)}
              />
              <Label
                htmlFor={`department-${department.id}`}
                className='text-[14px] leading-5'
              >
                {department.name}
              </Label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>
          Categorias
        </h3>
        <ul
          className={cn(
            'mt-4 flex flex-col gap-2 transition-opacity',
            isPending && 'opacity-60',
          )}
        >
          {categories.map((category) => (
            <li key={category.id} className='flex items-center gap-3'>
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categoryId === category.id}
                onCheckedChange={() => handleCategoryFilter(category.id)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>
          En oferta
        </h3>
        <div className='mt-4 flex items-center gap-3'>
          <Checkbox
            id='featured'
            checked={filters.featured === true}
            onCheckedChange={() => handleFeaturedProduct(!filters.featured)}
          />
          <Label htmlFor='featured'>Productos destacados</Label>
        </div>
      </section>
    </div>
  );
};
