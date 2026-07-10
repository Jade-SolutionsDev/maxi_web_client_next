import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Whether a nav href is the active route for the current pathname.
 * '/' matches only exactly; any other href also matches its subroutes
 * (e.g. '/catalogo/arroz' activates '/catalogo').
 */
export const isActiveHref = (href: string, pathname: string) =>
  href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`);
