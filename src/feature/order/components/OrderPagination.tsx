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
import {
  buildOrdersPageHref,
  FIRST_ORDERS_PAGE,
} from '../lib/orders-pagination';

type OrderPaginationProps = {
  page: number;
  totalPages: number;
};

export const OrderPagination = ({ page, totalPages }: OrderPaginationProps) => {
  if (totalPages <= FIRST_ORDERS_PAGE) return null;

  return (
    <Pagination aria-label='Paginación de pedidos'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildOrdersPageHref(page - 1)}
            disabled={page <= FIRST_ORDERS_PAGE}
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
                href={buildOrdersPageHref(slot)}
                isActive={slot === page}
                aria-label={`Ir a la página ${slot}`}
              >
                {slot}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildOrdersPageHref(page + 1)}
            disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
