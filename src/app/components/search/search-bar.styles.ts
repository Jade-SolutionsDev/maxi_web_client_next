/**
 * Shared classes for the header search field. Used by the interactive
 * {@link SearchBar} and by its static prerender fallback
 * ({@link SearchBarFallback}) so the two never drift and the field does not
 * shift when the hydrated version streams in.
 */

/** The rounded white pill that holds the input and its trailing actions. */
export const searchFieldClass =
  'relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition duration-200 hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary';

/**
 * Trailing action slot, anchored to the right edge: the clear button (only
 * while there is text) and the submit icon. Anchoring it means the magnifier
 * never moves when the clear button appears.
 */
export const searchActionsClass =
  'absolute inset-y-0 right-1.5 flex items-center gap-0.5';

/** Submit button in the interactive version, plain icon slot in the fallback. */
export const searchIconClass =
  'flex h-9 w-9 items-center justify-center rounded-full text-primary';

/** Clear button: quieter than the submit icon, it is a secondary action. */
export const searchClearClass =
  'flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60';

/**
 * `pr-22` reserves room for both trailing actions, and the WebKit reset drops
 * the native `type='search'` cross so it never doubles up with ours.
 */
export const searchInputClass =
  'w-full rounded-full bg-transparent py-3 pr-22 pl-5 text-heading placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none';

export const SEARCH_PLACEHOLDER = 'Buscar productos…';
