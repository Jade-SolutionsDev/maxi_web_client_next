import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api } from '@/api/http';
import { toMunicipality, toProvince } from '../adapter/location.adapter';
import type {
  LocationCatalog,
  Municipality,
  MunicipalityResponse,
  Province,
  ProvinceResponse,
} from '../type/location.interface';

/**
 * Provinces and municipalities are reference data: public, identical for every
 * visitor, and stable for years. `'use cache'` keeps them out of the request
 * path entirely; `days` revalidates once a day in the background.
 *
 * Both services call `api()` and never `apiAuth()` on purpose — resolving the
 * Clerk token reads request headers, which is illegal inside a cache scope.
 */
export const getProvinces = async (): Promise<Province[]> => {
  'use cache';
  cacheLife('days');

  const { data } = await api<ApiResponse<ProvinceResponse[]>>('/provinces');

  return data.map(toProvince);
};

/** `provinceId` is part of the cache key, so each province gets its own entry. */
export const getMunicipalities = async (
  provinceId: string,
): Promise<Municipality[]> => {
  'use cache';
  cacheLife('days');

  const { data } = await api<ApiResponse<MunicipalityResponse[]>>(
    `/provinces/${encodeURIComponent(provinceId)}/municipalities`,
  );

  return data.map(toMunicipality);
};

export const getLocationCatalog = async (): Promise<LocationCatalog> => {
  'use cache';
  cacheLife('days');
  cacheTag('location-catalog');

  const provinces = await getProvinces();
  const lists = await Promise.all(
    provinces.map((province) => getMunicipalities(province.id)),
  );

  return {
    provinces,
    municipalitiesByProvince: Object.fromEntries(
      provinces.map((province, index) => [province.id, lists[index]]),
    ),
  };
};
 