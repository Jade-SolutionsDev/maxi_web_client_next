'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';
import { buildPaginationRange, PAGINATION_ELLIPSIS } from '@/helpers';
import { cn } from '@/lib/utils';
import { buildCatalogPageHref } from '../constants/catalog-search-href';
import { FIRST_PAGE } from '../constants/product-search-params';
import { useCatalogFilterState } from './filters/catalog-filters.context';

type CatalogPaginationProps = {
  page: number;
  totalPages: number;
};

export const CatalogPagination = ({
  page,
  totalPages,
}: CatalogPaginationProps) => {
  const { requestScroll, isPending, filters } = useCatalogFilterState();

  const hrefFor = (target: number) => buildCatalogPageHref(target, filters);

  // The links navigate on their own; `scroll={false}` stops Next from jumping to
  // the top of the page so the results land under the header instead of behind
  // the hero.
  const linkProps = { scroll: false as const, onClick: () => requestScroll() };

  return (
    <Pagination className={cn(isPending && 'opacity-60')}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hrefFor(page - 1)}
            disabled={page <= FIRST_PAGE}
            {...linkProps}
          />
        </PaginationItem>

        {buildPaginationRange(page, totalPages).map((slot, index) => (
          <PaginationItem
            key={slot === PAGINATION_ELLIPSIS ? `${slot}-${index}` : slot}
          >
            {slot === PAGINATION_ELLIPSIS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={hrefFor(slot)}
                isActive={slot === page}
                aria-label={`Ir a la página ${slot}`}
                {...linkProps}
              >
                {slot}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hrefFor(page + 1)}
            disabled={page >= totalPages}
            {...linkProps}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
