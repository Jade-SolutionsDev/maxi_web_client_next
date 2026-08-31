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
  // Sin esta etiqueta el `days` no se puede invalidar: al asignar cobertura a un
  // almacén la API avisa con el tag `location-catalog`, pero solo lo llevaba
  // `getLocationCatalog`, no esta caché ni la de municipios —de las que sale el
  // selector—, así que se quedaban con la lista vacía cacheada de antes.
  cacheTag('location-catalog');

  try {
    const { data } = await api<ApiResponse<ProvinceResponse[]>>('/provinces');
    return data.map(toProvince);
  } catch {
    return [];
  }
};

/** `provinceId` is part of the cache key, so each province gets its own entry. */
export const getMunicipalities = async (
  provinceId: string,
): Promise<Municipality[]> => {
  'use cache';
  cacheLife('days');
  // Misma etiqueta que las provincias: una sola revalidación de `location-catalog`
  // limpia todas las entradas (una por provincia) cuando cambia la cobertura.
  cacheTag('location-catalog');

  try {
    const { data } = await api<ApiResponse<MunicipalityResponse[]>>(
      `/provinces/${encodeURIComponent(provinceId)}/municipalities`,
    );
    return data.map(toMunicipality);
  } catch {
    return [];
  }
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
