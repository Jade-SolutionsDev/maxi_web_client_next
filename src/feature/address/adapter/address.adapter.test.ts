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
  recipientName: null,
  idCard: null,
  contactPhone: null,
  location: null,
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

  // MxH-0072. El punto no pasa por `optional()` como los textos: aquí «sin
  // punto» es un estado que se pinta, no una ausencia que se ignora, y un
  // `{ latitude: 0, longitude: 0 }` inventado centraría el mapa en el Atlántico.
  it('deja el punto en null cuando la dirección no tiene', () => {
    expect(toAddress(response).location).toBeNull();
  });

  it('pasa el punto tal cual, con su procedencia', () => {
    const address = toAddress({
      ...response,
      location: {
        latitude: 23.102847,
        longitude: -82.409263,
        source: 'device',
      },
    });

    expect(address.location).toEqual({
      latitude: 23.102847,
      longitude: -82.409263,
      source: 'device',
    });
  });
});
