/** Raw cart line as returned by the storefront API. */
export interface CartItemResponse {
  productId: string;
  name: string;
  slug: string;
  /** Nullable until the file server is configured. */
  imageUrl: string | null;
  /** e.g. "Bolsa 1 kg", "Botella 900 ml". */
  format: string | null;
  /** 'unidad' | 'kg' | 'g' | 'L' | 'ml'... */
  measureUnit: string;
  quantity: number;
  /** Current discounted price, recomputed from the live catalog on every read. */
  unitPrice: number;
  /** `unitPrice × quantity`, computed by the API. */
  lineTotal: number;
  /** Current total stock across all storages. */
  available: number;
  /** False once the product was deactivated or stock dropped below `quantity`. */
  isAvailable: boolean;
  /** Not sent yet: the savings UI stays hidden until the API provides it. */
  basePrice?: number;
  /** 0–100, numeric. Not sent yet. */
  discount?: number;
}

/** Raw cart as returned by every cart endpoint, mutations included. */
export interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  measureUnit: string;
  format?: string;
  image?: string;
  quantity: number;
  /** Owned by the server. Never derived on the client for an account cart. */
  unitPrice: number;
  lineTotal: number;
  available: number;
  isAvailable: boolean;
  /** Drives the discount badge; absent means the line has no known discount. */
  discount?: number;
  /** Pre-discount unit price, when the source knows it. */
  basePrice?: number;
}

export interface Cart {
  lines: CartLine[];
  totalItems: number;
  subtotal: number;
}

export const EMPTY_CART: Cart = { lines: [], totalItems: 0, subtotal: 0 };

/**
 * A cart request the API refused. `kind` is what the UI branches on, so the
 * reason never has to be recovered by parsing an error message.
 */
export type CartFailure =
  | { kind: 'insufficient-stock'; available: number }
  | { kind: 'not-found' }
  | { kind: 'unauthenticated' }
  | { kind: 'unknown' };

export type CartResult =
  | { cart: Cart; failure?: undefined }
  | { cart?: undefined; failure: CartFailure };

/** What the guest cart keeps in `localStorage` between visits. */
export interface GuestLine {
  productId: string;
  slug: string;
  name: string;
  measureUnit: string;
  format?: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  available: number;
  discount?: number;
}

/**
 * What the merge changed on the way in, so the customer is told instead of
 * silently receiving a smaller cart than the one they built.
 */
export interface MergeReport {
  clamped: { name: string; requested: number; granted: number }[];
  dropped: { name: string }[];
}

export type MergeResult =
  | { cart: Cart; report: MergeReport; failure?: undefined }
  | { cart?: undefined; report?: undefined; failure: CartFailure };
