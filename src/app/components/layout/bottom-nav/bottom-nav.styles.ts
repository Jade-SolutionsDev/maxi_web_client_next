import { cn } from '@/lib/utils';

export const bottomNavClass =
  'fixed inset-x-0 bottom-0 z-30 border-t border-input bg-white pb-[env(safe-area-inset-bottom)] md:hidden';

export const bottomNavBarClass = 'flex items-stretch';

export const bottomNavItemClass = (isActive: boolean) =>
  cn(
    'relative flex h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 px-1 text-[0.6875rem] leading-none font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50',
    isActive ? 'text-accent' : 'text-muted hover:text-heading',
  );

export const bottomNavIconClass = 'size-6 shrink-0';
