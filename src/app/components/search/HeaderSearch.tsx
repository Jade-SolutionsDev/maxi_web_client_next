'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { SearchBar } from '@/app/components/search/SearchBar';
import { buildCatalogSearchHref } from '@/feature/product/constants/catalog-search-href';
import {
  productSearchParams,
  SEARCH_QUERY_KEY,
} from '@/feature/product/constants/product-search-params';

type HeaderSearchProps = {
  className?: string;
};

/**
 * Wires the header search field to the catalog. Reads the filters through nuqs,
 * which is what actually owns the catalog URL: `useSearchParams()` did not see
 * the filters the customer had just applied, so searching threw them away.
 */
export const HeaderSearch = ({ className }: HeaderSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters] = useQueryStates(productSearchParams);

  const handleSubmit = (query: string) => {
    router.push(buildCatalogSearchHref(query, pathname, filters));
  };

  return (
    <SearchBar
      className={className}
      defaultValue={filters[SEARCH_QUERY_KEY] ?? ''}
      onSubmit={handleSubmit}
    />
  );
};
