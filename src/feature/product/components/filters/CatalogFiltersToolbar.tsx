'use client';

import { ListFilter } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import { CatalogFiltersBadge } from './CatalogFiltersBadge';
import { CatalogFiltersClear } from './CatalogFiltersClear';
import { useCatalogFilterState } from './catalog-filters.context';
import { FilterGroups } from './FilterGroups';
import { SortControl } from './SortControl';

export const CatalogFiltersToolbar = () => {
  const { setScrollSuspended } = useCatalogFilterState();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setScrollSuspended(open);
  };

  return (
    <div className='flex items-center justify-between gap-3 md:hidden'>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-heading/15 bg-white px-4 font-semibold text-heading shadow-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
          <ListFilter className='size-4 text-primary' aria-hidden='true' />
          Filtros
          <CatalogFiltersBadge />
        </SheetTrigger>

        <SheetContent side='left' className='w-[86%] max-w-sm'>
          <SheetHeader className='flex-row items-center gap-2 border-b border-heading/5'>
            <ListFilter size={18} className='text-primary' aria-hidden='true' />
            <SheetTitle>Filtros</SheetTitle>
            <CatalogFiltersBadge />
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-4 py-5'>
            <FilterGroups />
          </div>

          <SheetFooter className='flex-row gap-3 border-t border-heading/5'>
            <CatalogFiltersClear className='flex-1 rounded-xl border border-heading/15 py-3 font-semibold text-heading hover:bg-surface' />
            <SheetClose className='flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
              Ver resultados
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <SortControl />
    </div>
  );
};
