'use client';

import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import type { Category } from '@/feature/categories/type/category.interface';
import type { Department } from '@/feature/department/type/department.interface';
import { cn } from '@/lib/utils';
import { useProductFilter } from '../filters/catalog.filter';
import { ListFilter, X } from 'lucide-react';
import { PriceFilter } from './filters/PriceFilter';

interface SideBarFilterProps {
  departments: Department[];
  categories: Category[];
}

export const SideBarFilter = ({
  departments,
  categories,
}: SideBarFilterProps) => {
  const {
    filters,
    handleCategoryFilter,
    handleDepartmentFilter,
    handleFeaturedProduct,
    isPending,
    clearAllFilter,
    hasActiveFilter,
    activeFilterCount,
  } = useProductFilter();

  return (
    <aside className='max-w-70 w-full flex flex-col h-fit py-6 px-6.5 rounded-[18px] bg-white shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-2 items-center'>
          <ListFilter size={20} className='text-heading' />
          <span className='text-heading text-xl font-bold'>Filtros</span>
          {hasActiveFilter && (
            <span className='rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-primary'>
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilter && (
          <button
            type='button'
            className='flex items-center gap-1 text-sm text-muted transition-colors hover:text-heading'
            onClick={clearAllFilter}
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      <div className='mb-6'>
        <h2 className='text-heading text-[16px] font-bold uppercase'>Precio</h2>
        <PriceFilter />
      </div>

      <div className='mb-6'>
        <h2 className='text-heading text-[16px] font-bold uppercase'>
          Departamentos
        </h2>
        <ul className={cn('mt-4 flex flex-col gap-2 transition-opacity')}>
          {departments.map((department) => (
            <li key={department.id}>
              <div className='flex gap-2.5 items-center '>
                <Checkbox
                  checked={filters.departmentId === department.id}
                  onCheckedChange={() => handleDepartmentFilter(department.id)}
                  id={`department-${department.id}`}
                />
                <Label
                  className='text-[14px] leading-5'
                  htmlFor={`department-${department.id}`}
                >
                  {department.name}
                </Label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='mb-6'>
        <h2 className='text-heading text-[16px] font-bold uppercase'>
          Categorias
        </h2>
        <ul
          className={cn(
            'mt-4 flex flex-col gap-2 transition-opacity',
            isPending && 'opacity-60'
          )}
        >
          {categories.map((category) => (
            <li key={category.id}>
              <div className='flex gap-3 items-center'>
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={() => handleCategoryFilter(category.id)}
                />
                <Label htmlFor={`category-${category.id}`}>
                  {category.name}
                </Label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='mb-6'>
        <h2 className='text-heading text-[16px] font-bold uppercase'>
          En oferta
        </h2>
        <ul
          className={cn(
            'mt-4 flex flex-col gap-2 transition-opacity',
            isPending && 'opacity-60'
          )}
        >
          <div className='flex gap-3 items-center'>
            <Checkbox
              id={`featured`}
              checked={filters.featured === true}
              onCheckedChange={() => handleFeaturedProduct(!filters.featured)}
            />
            <Label htmlFor={`featured`}>Productos destacados</Label>
          </div>
        </ul>
      </div>
    </aside>
  );
};
