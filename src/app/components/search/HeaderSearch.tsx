'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/app/components/search/SearchBar';
import { buildCatalogSearchHref } from '@/feature/product/constants/catalog-search-href';
import { SEARCH_QUERY_KEY } from '@/feature/product/constants/product-search-params';

type HeaderSearchProps = {
  className?: string;
};

/**
 * Wires the header search field to the catalog. Reads `useSearchParams` — it
 * must be rendered inside a <Suspense> boundary (see {@link SearchBarFallback}),
 * otherwise it would drag the whole prerendered header shell into a dynamic hole.
 */
export const HeaderSearch = ({ className }: HeaderSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (query: string) => {
    router.push(buildCatalogSearchHref(query, pathname, searchParams));
  };

  return (
    <SearchBar
      className={className}
      defaultValue={searchParams.get(SEARCH_QUERY_KEY) ?? ''}
      onSubmit={handleSubmit}
    />
  );
};
