import type { Address, AddressResponse } from '../type/address.interface';

// Empty optionals arrive as null (or blank) from the API and leave as undefined,
// so a component can just check for presence instead of testing both.
const optional = (value: string | null): string | undefined =>
  value?.trim() ? value.trim() : undefined;

export const toAddress = (response: AddressResponse): Address => ({
  id: response.id,
  label: optional(response.label),
  street: response.street.trim(),
  betweenStreets: optional(response.betweenStreets),
  reference: optional(response.reference),
  municipalityId: response.municipalityId,
  municipalityName: response.municipalityName,
  provinceId: response.provinceId,
  provinceName: response.provinceName,
  contactPhone: optional(response.contactPhone),
  isDefault: response.isDefault,
});
