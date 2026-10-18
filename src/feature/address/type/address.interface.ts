/**
 * Raw address as returned by `GET /storefront/addresses`.
 *
 * `provinceId` and `provinceName` are resolved by the API from the geography
 * catalog — an address stores only its municipality, so the two can never
 * disagree. Both name fields come back empty if the municipality ever leaves
 * the catalog; the address stays readable instead of the list failing.
 */
/**
 * De dónde salió el punto en el mapa. No merecen la misma confianza: el del
 * navegador lo da el GPS, el marcado a mano puede estar a dos cuadras, y quien
 * entrega necesita saber cuál está mirando.
 */
export type LocationSource = 'device' | 'manual';

/** Las tres partes van juntas: la API nunca manda media. */
export interface AddressLocation {
  latitude: number;
  longitude: number;
  source: LocationSource;
}

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
  recipientName: string | null;
  idCard: string | null;
  contactPhone: string | null;
  /** `null` cuando la dirección no tiene punto en el mapa. */
  location: AddressLocation | null;
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
  recipientName?: string;
  idCard?: string;
  contactPhone?: string;
  /**
   * El punto en el mapa. Se queda en `null` y no pasa a `undefined` como el
   * resto de los opcionales: aquí «no hay punto» es un estado que se pinta
   * —con el aviso de «sin ubicación»— y no una ausencia que se ignora.
   */
  location: AddressLocation | null;
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
