import type { GuestLine } from '../type/cart.interface';

const STORAGE_KEY = 'cart-storage';
const VERSION = 1;

interface StoredCart {
  version: number;
  lines: GuestLine[];
}

interface LegacyItem {
  id?: unknown;
  slug?: unknown;
  name?: unknown;
  measureUnit?: unknown;
  format?: unknown;
  image?: unknown;
  price?: unknown;
  available?: unknown;
  discount?: unknown;
  quantity?: unknown;
}

const isPositiveInt = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const toLine = (item: LegacyItem): GuestLine | null => {
  const productId = item.id ?? (item as { productId?: unknown }).productId;
  const unitPrice = item.price ?? (item as { unitPrice?: unknown }).unitPrice;

  if (typeof productId !== 'string' || !isPositiveInt(item.quantity))
    return null;
  if (typeof unitPrice !== 'number' || typeof item.name !== 'string')
    return null;

  return {
    productId,
    slug: typeof item.slug === 'string' ? item.slug : '',
    name: item.name,
    measureUnit:
      typeof item.measureUnit === 'string' ? item.measureUnit : 'unidad',
    format: typeof item.format === 'string' ? item.format : undefined,
    image: typeof item.image === 'string' ? item.image : undefined,
    quantity: item.quantity,
    unitPrice,
    available: typeof item.available === 'number' ? item.available : 0,
    discount:
      typeof item.discount === 'number' && item.discount > 0
        ? item.discount
        : undefined,
  };
};

const parse = (raw: string): GuestLine[] => {
  const parsed: unknown = JSON.parse(raw);

  const candidates =
    (parsed as StoredCart)?.lines ??
    (parsed as { state?: { items?: unknown } })?.state?.items;

  if (!Array.isArray(candidates)) return [];

  return candidates
    .map(toLine)
    .filter((line): line is GuestLine => line !== null);
};

export const readGuestLines = (): GuestLine[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw ? parse(raw) : [];
  } catch {
    return [];
  }
};

export const writeGuestLines = (lines: GuestLine[]) => {
  if (typeof window === 'undefined') return;

  try {
    const payload: StoredCart = { version: VERSION, lines };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // A full or blocked storage must not take the cart down with it.
  }
};

export const clearGuestLines = () => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
};
