'use client';

import { ListFilter, X } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import type { Category } from '@/feature/categories/type/category.interface';
import type { Department } from '@/feature/department/type/department.interface';
import { useProductFilter } from '../filters/catalog.filter';
import { FilterGroups } from './filters/FilterGroups';
import { SortControl } from './filters/SortControl';

interface CatalogFiltersProps {
  departments: Department[];
  categories: Category[];
}

const CountBadge = ({ count }: { count: number }) => (
  <span className='inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white'>
    {count}
  </span>
);

export const CatalogFilters = ({
  departments,
  categories,
}: CatalogFiltersProps) => {
  const { hasActiveFilter, activeFilterCount, clearAllFilter } =
    useProductFilter();

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className='hidden h-fit w-full max-w-70 flex-col rounded-[18px] bg-white px-6.5 py-6 shadow-md md:flex'>
        <header className='mb-6 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <ListFilter size={20} className='text-heading' />
            <h2 className='text-xl font-bold text-heading'>Filtros</h2>
            {hasActiveFilter && <CountBadge count={activeFilterCount} />}
          </div>
          {hasActiveFilter && (
            <button
              type='button'
              onClick={clearAllFilter}
              className='flex items-center gap-1 text-sm text-muted transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded'
            >
              <X size={14} />
              Limpiar
            </button>
          )}
        </header>
        <FilterGroups departments={departments} categories={categories} />
      </aside>

      {/* Mobile: filter drawer + sort control share one toolbar row */}
      <div className='flex items-center justify-between gap-3 md:hidden'>
        <Sheet>
          <SheetTrigger className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-heading/15 bg-white px-4 font-semibold text-heading shadow-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
            <ListFilter className='size-4 text-primary' />
            Filtros
            {hasActiveFilter && <CountBadge count={activeFilterCount} />}
          </SheetTrigger>

          <SheetContent side='left' className='w-[86%] max-w-sm'>
            <SheetHeader className='flex-row items-center gap-2 border-b border-heading/5'>
              <ListFilter size={18} className='text-primary' />
              <SheetTitle>Filtros</SheetTitle>
              {hasActiveFilter && <CountBadge count={activeFilterCount} />}
            </SheetHeader>

            <div className='flex-1 overflow-y-auto px-4 py-5'>
              <FilterGroups departments={departments} categories={categories} />
            </div>

            <SheetFooter className='flex-row gap-3 border-t border-heading/5'>
              {hasActiveFilter && (
                <button
                  type='button'
                  onClick={clearAllFilter}
                  className='flex-1 rounded-xl border border-heading/15 py-3 font-semibold text-heading transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                >
                  Limpiar
                </button>
              )}
              <SheetClose className='flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
                Ver resultados
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <SortControl />
      </div>
    </>
  );
};
