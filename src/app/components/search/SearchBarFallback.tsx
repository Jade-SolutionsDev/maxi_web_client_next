import { Search } from 'lucide-react';
import {
  SEARCH_PLACEHOLDER,
  searchActionsClass,
  searchFieldClass,
  searchIconClass,
  searchInputClass,
} from './search-bar.styles';

type SearchBarFallbackProps = {
  className?: string;
};

/**
 * Static search field rendered in the prerendered shell while the interactive
 * {@link HeaderSearch} streams in. It keeps the <search> landmark and the field
 * in the static HTML (good for SEO/a11y) and holds the exact same footprint, so
 * the header does not shift on hydration. It has no submit handler — the input
 * is disabled until the real one arrives, rather than silently swallowing an
 * Enter the page cannot act on yet. No clear button either: there is nothing
 * typed to clear.
 */
export const SearchBarFallback = ({ className }: SearchBarFallbackProps) => (
  <search className={className}>
    <div className={searchFieldClass}>
      <label htmlFor='product-search-fallback' className='sr-only'>
        {SEARCH_PLACEHOLDER}
      </label>
      <input
        id='product-search-fallback'
        type='search'
        disabled
        placeholder={SEARCH_PLACEHOLDER}
        className={searchInputClass}
      />
      <div className={searchActionsClass}>
        <span className={searchIconClass} aria-hidden='true'>
          <Search className='h-5 w-5' />
        </span>
      </div>
    </div>
  </search>
);
