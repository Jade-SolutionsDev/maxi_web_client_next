'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useCatalogFilterState } from './catalog-filters.context';

type CatalogFiltersClearProps = {
  className?: string;
  children?: ReactNode;
};

export const CatalogFiltersClear = ({
  className,
  children,
}: CatalogFiltersClearProps) => {
  const { hasActiveFilter, clearAllFilter } = useCatalogFilterState();

  if (!hasActiveFilter) return null;

  return (
    <button
      type='button'
      onClick={clearAllFilter}
      className={cn(
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
    >
      {children ?? 'Limpiar'}
    </button>
  );
};
