'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';
import { useProductFilter } from '../../filters/catalog.filter';
import { useCatalogResultsScroll } from '../../hook/useCatalogResultsScroll';

type CatalogFilterState = ReturnType<typeof useProductFilter> &
  Pick<
    ReturnType<typeof useCatalogResultsScroll>,
    'requestScroll' | 'setScrollSuspended'
  >;

type CatalogFilterOptions = {
  groups: TaxonomyGroup[];
};

const CatalogFilterStateContext = createContext<CatalogFilterState | null>(
  null,
);

const CatalogFilterOptionsContext = createContext<CatalogFilterOptions | null>(
  null,
);

export function useCatalogFilterState() {
  const context = useContext(CatalogFilterStateContext);
  if (!context) {
    throw new Error(
      'Catalog filter parts must be used within a <CatalogFilters.Root />',
    );
  }
  return context;
}

export function useCatalogFilterOptions() {
  const context = useContext(CatalogFilterOptionsContext);
  if (!context) {
    throw new Error(
      'Catalog filter parts must be used within a <CatalogFilters.Options />',
    );
  }
  return context;
}

export const CatalogFiltersRoot = ({ children }: { children: ReactNode }) => {
  const { requestScroll, setScrollSuspended } = useCatalogResultsScroll();
  const filter = useProductFilter({ onFilterApplied: requestScroll });

  return (
    <CatalogFilterStateContext.Provider
      value={{ ...filter, requestScroll, setScrollSuspended }}
    >
      {children}
    </CatalogFilterStateContext.Provider>
  );
};

type CatalogFiltersOptionsProps = CatalogFilterOptions & {
  children: ReactNode;
};

export const CatalogFiltersOptions = ({
  groups,
  children,
}: CatalogFiltersOptionsProps) => (
  <CatalogFilterOptionsContext.Provider value={{ groups }}>
    {children}
  </CatalogFilterOptionsContext.Provider>
);
