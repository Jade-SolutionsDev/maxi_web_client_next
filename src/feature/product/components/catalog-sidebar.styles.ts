/**
 * Desktop filter panel shell, shared by `CatalogFilters` and its skeleton so the
 * layout never shifts when the suspended sidebar resolves.
 *
 * The panel sticks below the header (`--header-height`) once it scrolls into
 * place, letting the product grid scroll past it. `self-start` keeps the flex
 * row from stretching it to full height — a stretched element has no travel
 * room and would never stick. The capped height plus `overflow-y-auto` is the
 * safety net for long department/category lists: the panel scrolls internally
 * instead of overflowing the viewport, and `overscroll-contain` stops that
 * scroll from chaining back to the page. `no-scrollbar` hides that inner bar so
 * the card keeps its clean edge — the list itself signals there is more below.
 */
export const catalogSidebarClass =
  'no-scrollbar sticky top-[calc(var(--header-height)_+_1.5rem)] hidden h-fit max-h-[calc(100svh_-_var(--header-height)_-_3rem)] w-full max-w-70 flex-col self-start overflow-y-auto overscroll-contain rounded-[18px] bg-white px-6.5 py-6 shadow-md md:flex';
