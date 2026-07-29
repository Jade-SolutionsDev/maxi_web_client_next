import { describe, expect, it } from 'vitest';
import type { LocationCatalog } from '../type/location.interface';
import { findSelection, toLocationOptions } from './location-catalog';

const habana = 'f3f09219-18cc-44ec-b297-41853727c21e';
const pinar = '8a2c1f44-2b6e-4a71-9c05-6d0b8e3f1a92';
const artemisa = '1c7d5e90-3f42-4b88-a6e1-0947c2db5f36';

const habanaVieja = 'd856282a-b90d-46cd-9937-157cda0579e2';
const plaza = '5b41e0c7-9d38-4e26-8f1a-2c63b70d94ae';
const vinales = 'e093b71d-6c25-4a03-b8f7-41d59e2860ca';

const catalog: LocationCatalog = {
  provinces: [
    { id: habana, name: 'La Habana', code: 'CU-03' },
    { id: pinar, name: 'Pinar del Río', code: 'CU-01' },
    { id: artemisa, name: 'Artemisa', code: 'CU-15' },
  ],
  municipalitiesByProvince: {
    [habana]: [
      {
        id: habanaVieja,
        provinceId: habana,
        name: 'Habana Vieja',
        code: 'CU-03-09',
      },
      {
        id: plaza,
        provinceId: habana,
        name: 'Plaza de la Revolución',
        code: 'CU-03-01',
      },
    ],
    [pinar]: [
      { id: vinales, provinceId: pinar, name: 'Viñales', code: 'CU-01-04' },
    ],
    [artemisa]: [],
  },
};

describe('toLocationOptions', () => {
  it('maps every province to a value/label pair', () => {
    expect(toLocationOptions(catalog).provinces).toEqual([
      { value: habana, label: 'La Habana' },
      { value: pinar, label: 'Pinar del Río' },
      { value: artemisa, label: 'Artemisa' },
    ]);
  });

  it('groups municipality options under their owning province', () => {
    expect(toLocationOptions(catalog).municipalitiesByProvince[habana]).toEqual([
      { value: habanaVieja, label: 'Habana Vieja' },
      { value: plaza, label: 'Plaza de la Revolución' },
    ]);
  });

  it('keeps a province with no municipalities as an empty array', () => {
    // FormSelect auto-disables on `options.length === 0`; `undefined` would crash it.
    expect(
      toLocationOptions(catalog).municipalitiesByProvince[artemisa],
    ).toEqual([]);
  });

  it('emits an entry for every province, even an empty one', () => {
    expect(
      Object.keys(toLocationOptions(catalog).municipalitiesByProvince).sort(),
    ).toEqual([habana, pinar, artemisa].sort());
  });
});

describe('findSelection', () => {
  it('resolves the province and municipality names from an id', () => {
    expect(findSelection(catalog, plaza)).toEqual({
      provinceId: habana,
      provinceName: 'La Habana',
      municipalityId: plaza,
      municipalityName: 'Plaza de la Revolución',
    });
  });

  it('finds a municipality in any province, not just the first', () => {
    expect(findSelection(catalog, vinales)?.provinceName).toBe('Pinar del Río');
  });

  it('returns null for an unknown municipality id', () => {
    expect(findSelection(catalog, 'not-a-real-id')).toBeNull();
  });

  it('returns null for an empty id', () => {
    expect(findSelection(catalog, '')).toBeNull();
  });

  it('returns null when the owning province is missing from the catalog', () => {
    // Stale cookie or a re-parented municipality: without this guard the badge
    // would render `undefined`.
    const orphaned: LocationCatalog = {
      provinces: [{ id: pinar, name: 'Pinar del Río', code: 'CU-01' }],
      municipalitiesByProvince: {
        [habana]: [
          {
            id: plaza,
            provinceId: habana,
            name: 'Plaza de la Revolución',
            code: 'CU-03-01',
          },
        ],
      },
    };

    expect(findSelection(orphaned, plaza)).toBeNull();
  });
});
