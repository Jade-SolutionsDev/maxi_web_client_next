/**
 * Shared classes for the header search field. Used by the interactive
 * {@link SearchBar} and by its static prerender fallback
 * ({@link SearchBarFallback}) so the two never drift and the field does not
 * shift when the hydrated version streams in.
 */

/** The rounded white pill that holds the icon and the input. */
export const searchFieldClass =
  'relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-primary/60';

/** Submit button in the interactive version, plain icon slot in the fallback. */
export const searchIconClass =
  'absolute left-2 flex h-9 w-9 items-center justify-center rounded-full text-muted';

export const searchInputClass =
  'w-full rounded-full bg-transparent py-3 pr-5 pl-12 text-heading placeholder:text-muted focus:outline-none';

export const SEARCH_PLACEHOLDER = 'Buscar productos…';
