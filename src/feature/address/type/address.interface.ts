/**
 * Raw address as returned by `GET /storefront/addresses`.
 *
 * `provinceId` and `provinceName` are resolved by the API from the geography
 * catalog — an address stores only its municipality, so the two can never
 * disagree. Both name fields come back empty if the municipality ever leaves
 * the catalog; the address stays readable instead of the list failing.
 */
export interface AddressResponse {
  id: string;
  label: string | null;
  street: string;
  betweenStreets: string | null;
  reference: string | null;
  municipalityId: string;
  municipalityName: string;
  provinceId: string;
  provinceName: string;
  contactPhone: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  street: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId: string;
  municipalityName: string;
  provinceId: string;
  provinceName: string;
  contactPhone?: string;
  isDefault: boolean;
}

export type AddressFailure =
  | { kind: 'unauthenticated' }
  | { kind: 'not-found' }
  | { kind: 'limit-reached' }
  | { kind: 'invalid' }
  | { kind: 'unknown' };

/** Mutations answer with nothing useful: the page re-reads through revalidatePath. */
export type AddressActionResult = { ok: true } | { failure: AddressFailure };
