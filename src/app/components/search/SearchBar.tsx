'use client';

import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { SEARCH_QUERY_KEY } from '@/feature/product/constants/product-search-params';
import { cn } from '@/lib/utils';
import {
  SEARCH_PLACEHOLDER,
  searchActionsClass,
  searchClearClass,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultValue);

  // The field is controlled so the clear button can follow what is typed, but
  // the URL still wins: when the caller hands us a different term (navigation,
  // reload) we adopt it during render instead of remounting the input.
  const [urlQuery, setUrlQuery] = useState(defaultValue);
  if (defaultValue !== urlQuery) {
    setUrlQuery(defaultValue);
    setQuery(defaultValue);
  }

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(query);
  };

  return (
    <search className={className}>
      {/* No role='search' here: the <search> landmark above already provides it. */}
      <form onSubmit={handleSubmit} className={searchFieldClass}>
        <label htmlFor='product-search' className='sr-only'>
          {placeholder}
        </label>
        <input
          ref={inputRef}
          id='product-search'
          name={SEARCH_QUERY_KEY}
          type='search'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // Escape empties the field instead of leaving a stale term behind.
            if (event.key === 'Escape' && query !== '') {
              event.preventDefault();
              clear();
            }
          }}
          placeholder={placeholder}
          className={searchInputClass}
        />

        <div className={searchActionsClass}>
          {query !== '' && (
            <button
              type='button'
              onClick={clear}
              aria-label='Limpiar búsqueda'
              className={searchClearClass}
            >
              <X className='h-4 w-4' aria-hidden='true' />
            </button>
          )}

          <button
            type='submit'
            aria-label='Buscar productos'
            className={cn(
              searchIconClass,
              'transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
            )}
          >
            <Search className='h-5 w-5' aria-hidden='true' />
          </button>
        </div>
      </form>
    </search>
  );
};
