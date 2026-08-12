'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';
import {
  useCatalogFilterOptions,
  useCatalogFilterState,
} from './catalog-filters.context';

const TAXONOMY_HEADING_ID = 'catalog-taxonomy-filter';

const findGroupOfCategory = (groups: TaxonomyGroup[], categoryId: string) =>
  groups.find((group) =>
    group.categories.some((category) => category.id === categoryId),
  );

const countClass = 'ml-auto text-xs text-muted tabular-nums';

export const TaxonomyFilterGroups = () => {
  const { groups } = useCatalogFilterOptions();
  const { filters, handleCategoryFilter, handleDepartmentFilter, isPending } =
    useCatalogFilterState();

  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    if (filters.departmentId) return [filters.departmentId];
    if (!filters.categoryId) return [];

    const owner = findGroupOfCategory(groups, filters.categoryId);
    return owner ? [owner.id] : [];
  });

  const selectDepartment = (departmentId: string) => {
    setOpenGroups((previous) =>
      previous.includes(departmentId) ? previous : [...previous, departmentId],
    );
    handleDepartmentFilter(departmentId);
  };

  return (
    <section aria-labelledby={TAXONOMY_HEADING_ID}>
      <h3
        id={TAXONOMY_HEADING_ID}
        className='text-[16px] font-bold uppercase text-heading'
      >
        Departamentos
      </h3>

      <Accordion.Root
        multiple
        value={openGroups}
        onValueChange={setOpenGroups}
        className={cn(
          'mt-4 flex flex-col gap-1 transition-opacity',
          isPending && 'opacity-60',
        )}
      >
        {groups.map((group) => (
          <Accordion.Item key={group.id} value={group.id}>
            <Accordion.Header render={<div />}>
              <div className='flex items-center gap-2.5'>
                <Checkbox
                  id={`department-${group.id}`}
                  checked={filters.departmentId === group.id}
                  onCheckedChange={() => selectDepartment(group.id)}
                />
                <Label
                  htmlFor={`department-${group.id}`}
                  className='flex-1 cursor-pointer text-[14px] leading-5'
                >
                  {group.name}
                </Label>
                <span className={countClass}>{group.productsCount}</span>
                <Accordion.Trigger
                  aria-label={`Ver categorías de ${group.name}`}
                  className='flex size-7 shrink-0 items-center justify-center rounded-md text-muted outline-none transition-colors hover:bg-black/5 focus-visible:ring-3 focus-visible:ring-ring/50'
                >
                  <ChevronDownIcon className='size-4 transition-transform duration-250 ease-out-quint data-panel-open:rotate-180 motion-reduce:transition-none' />
                </Accordion.Trigger>
              </div>
            </Accordion.Header>

            <Accordion.Panel
              hiddenUntilFound
              className='h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-250 ease-out-quint data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:duration-150 motion-reduce:transition-none'
            >
              <ul className='flex flex-col gap-2 py-2 pl-7.5'>
                {group.categories.map((category) => (
                  <li key={category.id} className='flex items-center gap-2.5'>
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categoryId === category.id}
                      onCheckedChange={() => handleCategoryFilter(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className='flex-1 cursor-pointer text-[14px] leading-5'
                    >
                      {category.name}
                    </Label>
                    <span className={countClass}>{category.productsCount}</span>
                  </li>
                ))}
              </ul>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
};
