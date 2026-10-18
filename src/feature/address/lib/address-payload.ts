import type { AddressFormValues } from '../schema/address.schema';
import type { AddressLocation } from '../type/address.interface';

/**
 * Lo que la API espera en `POST` y `PATCH /storefront/addresses`. Vive aquí y
 * no en el servicio porque el servicio es `server-only` y esto hay que poder
 * probarlo: la traducción del formulario al payload es donde se pierden los
 * datos en silencio, no en la llamada.
 */
export interface AddressPayload {
  label?: string;
  street: string;
  betweenStreets?: string;
  reference?: string;
  municipalityId: string;
  contactPhone?: string;
  /**
   * **`null` no es lo mismo que ausente**, y es el único campo del payload
   * donde la diferencia cuenta: `null` le dice a la API «quita el punto» y
   * omitirlo le dice «déjalo como está».
   */
  location?: AddressLocation | null;
}

/**
 * El formulario dice «sin valor» con una cadena vacía y la API lo quiere
 * ausente. De ahí el `|| undefined` de cada texto.
 *
 * **`location` rompe esa regla a propósito.** Con el mismo patrón, un `null` se
 * convertiría en ausencia, la API lo leería como «no toques el punto» y
 * **quitar una ubicación dejaría de funcionar sin que nada fallara**: el botón
 * respondería, el formulario se cerraría y el punto seguiría ahí al recargar.
 * Hay una prueba cuyo único trabajo es que ese `null` llegue entero.
 */
export const toAddressPayload = (
  values: AddressFormValues,
): AddressPayload => ({
  street: values.street,
  municipalityId: values.municipalityId,
  label: values.label || undefined,
  betweenStreets: values.betweenStreets || undefined,
  reference: values.reference || undefined,
  contactPhone: values.contactPhone || undefined,
  location: values.location === undefined ? undefined : values.location,
});
