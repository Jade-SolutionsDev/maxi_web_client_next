/**
 * Shared pure helpers. Check this file before writing a new utility —
 * duplicating one that already lives here is how the codebase drifts.
 */

import { CURRENCY_CODE, CURRENCY_LOCALE } from '@/lib/currency';

const priceFormatters = new Map<string, Intl.NumberFormat>();

const getPriceFormatter = (locale: string, currency: string) => {
  const key = `${locale}/${currency}`;
  const cached = priceFormatters.get(key);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
  priceFormatters.set(key, formatter);

  return formatter;
};

/**
 * Format a numeric price as currency (e.g. 1.13 → "$1.13"). Defaults to the
 * store currency; pass `currency`/`locale` to format in another one.
 */
export const formatPrice = (
  value: number,
  currency: string = CURRENCY_CODE,
  locale: string = CURRENCY_LOCALE,
) => getPriceFormatter(locale, currency).format(value);

/**
 * Format a discount percentage as a badge label (e.g. 20 → "-20%").
 * Trims float noise to two decimals so "-19.999999%" never reaches the UI.
 */
export const formatDiscount = (discount: number) =>
  `-${Math.round(discount * 100) / 100}%`;

/**
 * Shorten `text` to at most `max` characters, breaking on a word boundary and
 * marking the cut with an ellipsis. Used for meta descriptions, where search
 * engines clip anything past ~155 characters anyway.
 */
export const truncate = (text: string, max: number): string => {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;

  // Reserve one character for the ellipsis so the result respects `max`.
  const clipped = trimmed.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const cut = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped;

  return `${cut.trimEnd()}…`;
};

/** Constrain `value` to the inclusive `[min, max]` range. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Round a money amount to cents. Summing prices in binary floating point drifts
 * (0.1 * 3 = 0.30000000000000004), and a total is read digit by digit.
 */
export const roundMoney = (value: number) => Math.round(value * 100) / 100;

/** Ascending list of the integers in the inclusive `[from, to]` range. */
export const range = (from: number, to: number): number[] =>
  Array.from({ length: Math.max(to - from + 1, 0) }, (_, i) => from + i);

export const PAGINATION_ELLIPSIS = 'ellipsis';

export type PaginationSlot = number | typeof PAGINATION_ELLIPSIS;

/**
 * Page slots to render for a paginated list: the first page, the last page, a
 * window of `siblings` around the current one, and `ellipsis` markers wherever
 * the sequence jumps. Keeps the control at a fixed width no matter how many
 * pages exist.
 */
export const buildPaginationRange = (
  page: number,
  totalPages: number,
  siblings = 1,
): PaginationSlot[] => {
  if (totalPages <= 0) return [];

  const current = clamp(page, 1, totalPages);
  // First, last, current, both sibling windows and the two ellipsis markers.
  // Below that width every page fits, so an ellipsis would replace nothing.
  const slotCount = siblings * 2 + 5;
  if (totalPages <= slotCount) return range(1, totalPages);

  const firstSibling = Math.max(current - siblings, 1);
  const lastSibling = Math.min(current + siblings, totalPages);
  // Page 2 next to page 1 is not a jump: an ellipsis there would hide nothing
  // while costing the same width as the page it replaces.
  const hasLeftGap = firstSibling > 2;
  const hasRightGap = lastSibling < totalPages - 1;
  // Every branch below emits `slotCount` slots so the control keeps one width
  // across pages instead of resizing under the cursor between clicks.
  const blockSize = siblings * 2 + 3;

  if (!hasLeftGap)
    return [...range(1, blockSize), PAGINATION_ELLIPSIS, totalPages];

  if (!hasRightGap)
    return [
      1,
      PAGINATION_ELLIPSIS,
      ...range(totalPages - blockSize + 1, totalPages),
    ];

  return [
    1,
    PAGINATION_ELLIPSIS,
    ...range(firstSibling, lastSibling),
    PAGINATION_ELLIPSIS,
    totalPages,
  ];
};

/**
 * Derive up to two uppercase initials from a name.
 * "Ada Lovelace" → "AL", "Ada" → "A", "" → "".
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
};

export const normalizeSearchText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const toTelHref = (phone: string): string =>
  `tel:${phone.replace(/[^+\d]/g, '')}`;

export const toWhatsAppHref = (phone: string): string =>
  `https://wa.me/${phone.replace(/\D/g, '')}`;

export const markdownToPlainText = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[>\s]*[-*+]\s+/gm, ' ')
    .replace(/[#*_>|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
