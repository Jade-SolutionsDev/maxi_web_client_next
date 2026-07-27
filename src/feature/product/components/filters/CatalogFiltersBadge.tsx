'use client';

import { useCatalogFilterState } from './catalog-filters.context';

/**
 * Active filter count. Renders nothing while no filter is applied, so callers
 * compose it unconditionally instead of repeating the `hasActiveFilter` guard.
 */
export const CatalogFiltersBadge = () => {
  const { hasActiveFilter, activeFilterCount } = useCatalogFilterState();

  if (!hasActiveFilter) return null;

  return (
    <span className='inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white'>
      {activeFilterCount}
    </span>
  );
};
