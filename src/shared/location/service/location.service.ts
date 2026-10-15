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
const pedirProvincias = async (): Promise<Province[]> => {
  'use cache';
  cacheLife('days');
  // Sin esta etiqueta el `days` no se puede invalidar: al asignar cobertura a un
  // almacén la API avisa con el tag `location-catalog`, pero solo lo llevaba
  // `getLocationCatalog`, no esta caché ni la de municipios —de las que sale el
  // selector—, así que se quedaban con la lista vacía cacheada de antes.
  cacheTag('location-catalog');

  const { data } = await api<ApiResponse<ProvinceResponse[]>>('/provinces');
  return data.map(toProvince);
};

const pedirMunicipios = async (provinceId: string): Promise<Municipality[]> => {
  'use cache';
  cacheLife('days');
  // Misma etiqueta que las provincias: una sola revalidación de `location-catalog`
  // limpia todas las entradas (una por provincia) cuando cambia la cobertura.
  cacheTag('location-catalog');

  const { data } = await api<ApiResponse<MunicipalityResponse[]>>(
    `/provinces/${encodeURIComponent(provinceId)}/municipalities`,
  );
  return data.map(toMunicipality);
};

/**
 * El `try` va **fuera** de la caché, y esa es toda la gracia.
 *
 * Estaba dentro, así que un parpadeo de la API no devolvía una lista vacía: la
 * **guardaba**, y con `cacheLife('days')` se quedaba guardada hasta la
 * siguiente invalidación. Sin provincias no hay selector, la tienda no
 * reconoce el municipio de la cookie de nadie y vuelve a preguntar la zona a
 * todo el mundo. Un segundo malo de la API costaba horas de tienda sin zonas.
 *
 * Lanzando desde dentro, Next no guarda nada: el siguiente que pase lo vuelve a
 * pedir. Lo que se devuelve vacío es solo esta respuesta, no las de mañana.
 */
export const getProvinces = async (): Promise<Province[]> => {
  try {
    return await pedirProvincias();
  } catch {
    return [];
  }
};

/** `provinceId` is part of the cache key, so each province gets its own entry. */
export const getMunicipalities = async (
  provinceId: string,
): Promise<Municipality[]> => {
  try {
    return await pedirMunicipios(provinceId);
  } catch {
    return [];
  }
};

/**
 * Todos los municipios con cobertura, en **una** petición.
 *
 * El catálogo pedía uno por provincia —un `Promise.all` sobre la lista—, así
 * que cada render con la caché fría disparaba tantas peticiones como provincias
 * con cobertura. La API limita a 120 por minuto y **todas las llamadas de
 * servidor de la tienda comparten cubo**: desde dentro no hay cliente a quien
 * atribuirlas, así que la cuenta es de la tienda entera, no de cada visitante.
 *
 * Y se junta con lo de arriba: como el fallo ya no se cachea —a propósito—,
 * cada visita siguiente volvía a intentarlo entero. Medido en staging: 1.615
 * respuestas 429 en siete días, 830 de ellas durante una sola corrida de las
 * pruebas de navegador, que falsearon escenarios durante semanas.
 *
 * `GET /municipalities` ya devuelve el conjunto entero con `provinceId` en cada
 * fila, de modo que agrupar aquí no cuesta nada.
 */
const pedirTodosLosMunicipios = async (): Promise<Municipality[]> => {
  'use cache';
  cacheLife('days');
  cacheTag('location-catalog');

  const { data } =
    await api<ApiResponse<MunicipalityResponse[]>>('/municipalities');
  return data.map(toMunicipality);
};

const pedirCatalogo = async (): Promise<LocationCatalog> => {
  'use cache';
  cacheLife('days');
  cacheTag('location-catalog');

  // Las que lanzan, no las que se callan: si aquí se compusiera a partir de las
  // listas vacías de cortesía, el catálogo entero volvería a guardar el vacío
  // y no habríamos arreglado nada.
  const [provinces, municipios] = await Promise.all([
    pedirProvincias(),
    pedirTodosLosMunicipios(),
  ]);

  // Se siembra una entrada por provincia para no cambiar la forma del catálogo:
  // quien lee `municipalitiesByProvince[id]` sigue encontrando una lista.
  const porProvincia = new Map<string, Municipality[]>(
    provinces.map((province) => [province.id, []]),
  );
  for (const municipio of municipios) {
    porProvincia.get(municipio.provinceId)?.push(municipio);
  }

  return {
    provinces,
    municipalitiesByProvince: Object.fromEntries(porProvincia),
  };
};

export const getLocationCatalog = async (): Promise<LocationCatalog> => {
  try {
    return await pedirCatalogo();
  } catch {
    return { provinces: [], municipalitiesByProvince: {} };
  }
};
