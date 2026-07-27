'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { Category } from '@/feature/categories/type/category.interface';
import type { Department } from '@/feature/department/type/department.interface';
import { useProductFilter } from '../../filters/catalog.filter';

type CatalogFilterState = ReturnType<typeof useProductFilter>;

type CatalogFilterOptions = {
  departments: Department[];
  categories: Category[];
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
  const filter = useProductFilter();

  return (
    <CatalogFilterStateContext.Provider value={filter}>
      {children}
    </CatalogFilterStateContext.Provider>
  );
};

type CatalogFiltersOptionsProps = CatalogFilterOptions & {
  children: ReactNode;
};

export const CatalogFiltersOptions = ({
  departments,
  categories,
  children,
}: CatalogFiltersOptionsProps) => (
  <CatalogFilterOptionsContext.Provider value={{ departments, categories }}>
    {children}
  </CatalogFilterOptionsContext.Provider>
);
