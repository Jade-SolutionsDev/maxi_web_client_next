'use client';

import { ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/lib/utils';
import { SORT_OPTIONS } from '../../constants/product-search-params';
import { useCatalogFilterState } from './catalog-filters.context';

export const SortControl = () => {
  const { filters, handleSort, isPending } = useCatalogFilterState();

  const currentValue = `${filters.sortBy}:${filters.sortOrder}`;

  const handleValueChange = (value: string | null) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    if (option) handleSort(option.sortBy, option.sortOrder);
  };

  const labelFor = (value: string | null) =>
    SORT_OPTIONS.find((opt) => opt.value === value)?.label ?? 'Ordenar';

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label='Ordenar productos'
        className={cn(
          'gap-2 rounded-xl border-0 bg-white px-4 font-semibold text-heading shadow-sm transition-[opacity,background-color] focus-visible:ring-primary/60 data-[size=default]:h-12',
          isPending && 'opacity-60',
        )}
      >
        <ListFilter className='size-4 text-primary' />
        <SelectValue>{labelFor}</SelectValue>
      </SelectTrigger>
      <SelectContent
        align='start'
        alignItemWithTrigger={false}
        className='rounded-xl bg-white p-1.5 shadow-lg'
      >
        {SORT_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className='rounded-lg py-2.5 font-medium text-heading focus:bg-primary focus:text-white data-selected:font-semibold'
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
