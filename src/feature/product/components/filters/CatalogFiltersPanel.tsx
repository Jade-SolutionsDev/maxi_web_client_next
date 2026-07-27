'use client';

import { ListFilter, X } from 'lucide-react';
import { catalogSidebarClass } from '../catalog-sidebar.styles';
import { CatalogFiltersBadge } from './CatalogFiltersBadge';
import { CatalogFiltersClear } from './CatalogFiltersClear';
import { FilterGroups } from './FilterGroups';

/** Desktop layout: persistent sidebar, sticky under the header while the grid scrolls. */
export const CatalogFiltersPanel = () => (
  <aside className={catalogSidebarClass}>
    <header className='mb-6 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <ListFilter size={20} className='text-heading' aria-hidden='true' />
        <h2 className='text-xl font-bold text-heading'>Filtros</h2>
        <CatalogFiltersBadge />
      </div>

      <CatalogFiltersClear className='flex items-center gap-1 rounded text-sm text-muted hover:text-heading'>
        <X size={14} aria-hidden='true' />
        Limpiar
      </CatalogFiltersClear>
    </header>

    <FilterGroups />
  </aside>
);
