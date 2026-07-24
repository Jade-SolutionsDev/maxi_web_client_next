'use client';

import { Search } from 'lucide-react';
import { SEARCH_QUERY_KEY } from '@/feature/product/constants/product-search-params';
import { cn } from '@/lib/utils';
import {
  SEARCH_PLACEHOLDER,
  searchFieldClass,
  searchIconClass,
  searchInputClass,
} from './search-bar.styles';

interface SearchBarProps {
  /** Current search term, so the field mirrors the URL after a reload. */
  defaultValue?: string;
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Presentational search field. It owns the form semantics and nothing else —
 * where the search goes is the caller's decision (see {@link HeaderSearch}).
 * The width is controlled by whoever renders it, via `className`.
 */
export const SearchBar = ({
  defaultValue = '',
  onSubmit,
  placeholder = SEARCH_PLACEHOLDER,
  className,
}: SearchBarProps) => {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get(SEARCH_QUERY_KEY);
    onSubmit(typeof value === 'string' ? value : '');
  };

  return (
    <search className={className}>
      {/* No role='search' here: the <search> landmark above already provides it. */}
      <form onSubmit={handleSubmit} className={searchFieldClass}>
        <button
          type='submit'
          aria-label='Buscar productos'
          className={cn(
            searchIconClass,
            'transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
          )}
        >
          <Search className='h-5 w-5' aria-hidden='true' />
        </button>

        <label htmlFor='product-search' className='sr-only'>
          {placeholder}
        </label>
        <input
          key={defaultValue}
          id='product-search'
          name={SEARCH_QUERY_KEY}
          type='search'
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={searchInputClass}
        />
      </form>
    </search>
  );
};
