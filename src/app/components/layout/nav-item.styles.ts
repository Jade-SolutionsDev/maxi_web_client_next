import { cn } from '@/lib/utils';

/**
 * Shared classes for the desktop primary-nav container (relative for the
 * indicator). The sliding indicator is a transformed element, so it counts
 * towards the scrollable area — `no-scrollbar` keeps `overflow-x-auto` from
 * painting a bar under the links if it ever reaches the right edge, without
 * taking the scrolling itself away.
 */
export const primaryNavClass =
  'relative flex h-full items-center gap-6 overflow-x-auto no-scrollbar';

/**
 * Class list for a desktop primary-nav link. Shared by the interactive nav
 * ({@link PrimaryNav}) and its static prerender fallback ({@link NavItemsFallback})
 * so the two never drift. The active/hover highlight is a separate sliding
 * indicator, so the link itself only changes color here.
 */
export const navItemClass = (isActive: boolean) =>
  cn(
    'rounded-sm text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
    isActive ? 'text-white' : 'text-white/90 hover:text-white',
  );
