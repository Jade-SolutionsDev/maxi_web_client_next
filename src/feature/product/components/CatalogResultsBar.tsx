import { CatalogPagination } from './CatalogPagination';
import { PageSizeControl } from './filters/PageSizeControl';

type CatalogResultsBarProps = {
  page: number;
  totalPages: number;
};

export const CatalogResultsBar = ({
  page,
  totalPages,
}: CatalogResultsBarProps) => (
  <div className='mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-input/60 pt-6 sm:gap-4'>
    <PageSizeControl />

    {totalPages > 1 && (
      <CatalogPagination page={page} totalPages={totalPages} />
    )}
  </div>
);
