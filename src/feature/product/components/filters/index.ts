import { CatalogFiltersBadge } from './CatalogFiltersBadge';
import { CatalogFiltersClear } from './CatalogFiltersClear';
import { CatalogFiltersPanel } from './CatalogFiltersPanel';
import { CatalogFiltersToolbar } from './CatalogFiltersToolbar';
import {
  CatalogFiltersOptions,
  CatalogFiltersRoot,
} from './catalog-filters.context';
import { FilterGroups } from './FilterGroups';
import { PageSizeControl } from './PageSizeControl';
import { SortControl } from './SortControl';

export const CatalogFilters = {
  Root: CatalogFiltersRoot,
  Options: CatalogFiltersOptions,
  Panel: CatalogFiltersPanel,
  Toolbar: CatalogFiltersToolbar,
  Groups: FilterGroups,
  Sort: SortControl,
  PageSize: PageSizeControl,
  Badge: CatalogFiltersBadge,
  Clear: CatalogFiltersClear,
};
