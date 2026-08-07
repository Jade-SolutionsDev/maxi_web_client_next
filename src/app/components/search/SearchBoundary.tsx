import { Suspense } from 'react';
import { HeaderSearch } from './HeaderSearch';
import { SearchBarFallback } from './SearchBarFallback';

type SearchBoundaryProps = {
  className?: string;
};

export const SearchBoundary = ({ className }: SearchBoundaryProps) => (
  <Suspense fallback={<SearchBarFallback className={className} />}>
    <HeaderSearch className={className} />
  </Suspense>
);
