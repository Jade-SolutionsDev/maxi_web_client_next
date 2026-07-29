import { describe, expect, it } from 'vitest';
import type {
  MunicipalityResponse,
  ProvinceResponse,
} from '../type/location.interface';
import { toMunicipality, toProvince } from './location.adapter';

const provinceResponse: ProvinceResponse = {
  id: 'f3f09219-18cc-44ec-b297-41853727c21e',
  name: 'La Habana',
  code: 'CU-03',
};

const municipalityResponse: MunicipalityResponse = {
  id: 'd856282a-b90d-46cd-9937-157cda0579e2',
  provinceId: 'f3f09219-18cc-44ec-b297-41853727c21e',
  name: 'Habana Vieja',
  code: 'CU-03-09',
};

describe('toProvince', () => {
  it('maps every field of the API response', () => {
    expect(toProvince(provinceResponse)).toEqual({
      id: 'f3f09219-18cc-44ec-b297-41853727c21e',
      name: 'La Habana',
      code: 'CU-03',
    });
  });

  it('trims surrounding whitespace in the name', () => {
    expect(
      toProvince({ ...provinceResponse, name: '  Pinar del Río  ' }).name,
    ).toBe('Pinar del Río');
  });

  it('keeps accented names intact', () => {
    expect(toProvince({ ...provinceResponse, name: 'Camagüey' }).name).toBe(
      'Camagüey',
    );
  });
});

describe('toMunicipality', () => {
  it('maps every field of the API response', () => {
    expect(toMunicipality(municipalityResponse)).toEqual({
      id: 'd856282a-b90d-46cd-9937-157cda0579e2',
      provinceId: 'f3f09219-18cc-44ec-b297-41853727c21e',
      name: 'Habana Vieja',
      code: 'CU-03-09',
    });
  });

  it('preserves the owning province id', () => {
    expect(toMunicipality(municipalityResponse).provinceId).toBe(
      provinceResponse.id,
    );
  });

  it('trims surrounding whitespace in the name', () => {
    expect(
      toMunicipality({
        ...municipalityResponse,
        name: ' San Miguel del Padrón ',
      }).name,
    ).toBe('San Miguel del Padrón');
  });
});
