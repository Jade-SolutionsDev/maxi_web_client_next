import { describe, expect, it } from 'vitest';
import type { AddressResponse } from '../type/address.interface';
import { toAddress } from './address.adapter';

const response: AddressResponse = {
  id: 'addr-1',
  label: 'Casa',
  street: '  Calle 23 #456  ',
  betweenStreets: null,
  reference: null,
  municipalityId: 'mun-1',
  municipalityName: 'Plaza de la Revolución',
  provinceId: 'prov-1',
  provinceName: 'La Habana',
  contactPhone: null,
  isDefault: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('toAddress', () => {
  it('trims the street and drops empty optionals', () => {
    const address = toAddress(response);

    expect(address.street).toBe('Calle 23 #456');
    expect(address.betweenStreets).toBeUndefined();
    expect(address.reference).toBeUndefined();
    expect(address.contactPhone).toBeUndefined();
  });

  it('keeps the names the API already resolved', () => {
    const address = toAddress(response);

    expect(address.municipalityName).toBe('Plaza de la Revolución');
    expect(address.provinceName).toBe('La Habana');
    expect(address.isDefault).toBe(true);
  });

  it('treats a blank optional as absent, not as a value', () => {
    const address = toAddress({ ...response, label: '   ', reference: '' });

    expect(address.label).toBeUndefined();
    expect(address.reference).toBeUndefined();
  });
});
