'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/lib/utils';
import { PAGE_SIZE_OPTIONS } from '../../constants/product-search-params';
import { useCatalogFilterState } from './catalog-filters.context';

export const PageSizeControl = () => {
  const { filters, handlePageSize, isPending } = useCatalogFilterState();

  const handleValueChange = (value: string | null) => {
    const limit = Number(value);
    if (PAGE_SIZE_OPTIONS.some((option) => option === limit))
      handlePageSize(limit);
  };

  return (
    <div className='flex items-center gap-2'>
      <Select value={String(filters.limit)} onValueChange={handleValueChange}>
        <SelectTrigger
          aria-label='Productos por página'
          className={cn(
            'gap-2 rounded-xl border-0 bg-white px-4 font-semibold text-heading shadow-sm transition-[opacity,background-color] focus-visible:ring-primary/60 data-[size=default]:h-11',
            isPending && 'opacity-60',
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align='end'
          alignItemWithTrigger={false}
          className='rounded-xl bg-white p-1.5 shadow-lg'
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <SelectItem
              key={option}
              value={String(option)}
              className='rounded-lg py-2.5 font-medium text-heading focus:bg-primary focus:text-white data-selected:font-semibold'
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className='text-sm text-muted whitespace-nowrap'>por página</span>
    </div>
  );
};
