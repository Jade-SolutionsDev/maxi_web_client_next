import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.fn();

// El servicio es de servidor y `server-only` se niega a cargarse fuera de él.
// Aquí no hay cliente del que protegerse: es vitest leyendo una función.
vi.mock('server-only', () => ({}));

vi.mock('@/api/http', () => ({ api: (...args: unknown[]) => api(...args) }));
// `'use cache'` es del compilador de Next y aquí no cachea nada; lo que estas
// pruebas fijan es la forma del código que hace que no se cachee el fallo.
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

import {
  getLocationCatalog,
  getMunicipalities,
  getProvinces,
} from '@/shared/location/service/location.service';

/**
 * El `catch` vivía **dentro** del `'use cache'`, así que un parpadeo de la API
 * no devolvía una lista vacía: la guardaba, y con `cacheLife('days')` se
 * quedaba guardada. Sin provincias no hay selector, la tienda deja de
 * reconocer el municipio de la cookie y vuelve a preguntar la zona a todo el
 * mundo — hasta la siguiente invalidación.
 */
describe('El catálogo de ubicaciones no se queda con el fallo', () => {
  const PROVINCIA = { id: 'prov-1', name: 'La Habana' };
  const MUNICIPIO = { id: 'mun-1', name: 'Playa', provinceId: 'prov-1' };

  beforeEach(() => api.mockReset());

  /**
   * El fallo se provoca **devolviendo nada**, no lanzando desde el doble: el
   * servicio hace `const { data } = await api(...)` y revienta solo, que es lo
   * que pasaría con una respuesta rota de verdad. Lanzar desde el propio doble
   * ponía las tres pruebas en rojo con el código funcionando —vitest cuenta ese
   * throw como error del test aunque el `catch` lo recoja—; comprobado aparte
   * que `getProvinces` devuelve `[]` y no lanza.
   */
  const laApiParpadea = () => api.mockResolvedValue(undefined);

  it('sin provincias no inventa nada: devuelve la lista vacía', async () => {
    laApiParpadea();

    expect(await getProvinces()).toEqual([]);
  });

  it('lo mismo con los municipios de una provincia', async () => {
    laApiParpadea();

    expect(await getMunicipalities('prov-1')).toEqual([]);
  });

  /**
   * La que de verdad discrimina. Si el catálogo se compusiera a partir de las
   * listas vacías de cortesía, saldría «La Habana con cero municipios», que es
   * una respuesta **plausible y falsa**: se guardaría como buena. Al componerse
   * de las que lanzan, el catálogo entero falla y no hay nada que guardar.
   */
  it('si los municipios fallan, el catálogo entero falla: no hay media verdad que cachear', async () => {
    api.mockImplementation(async (ruta: string) =>
      ruta === '/provinces' ? { data: [PROVINCIA] } : undefined,
    );

    const catalogo = await getLocationCatalog();

    expect(catalogo).toEqual({ provinces: [], municipalitiesByProvince: {} });
    // Lo que NO puede pasar: una provincia servida con la lista vacía dentro.
    expect(catalogo.municipalitiesByProvince['prov-1']).toBeUndefined();
  });

  it('con la API sana, el catálogo trae lo suyo', async () => {
    api.mockImplementation(async (ruta: string) =>
      ruta === '/provinces' ? { data: [PROVINCIA] } : { data: [MUNICIPIO] },
    );

    const catalogo = await getLocationCatalog();

    expect(catalogo.provinces).toHaveLength(1);
    expect(catalogo.municipalitiesByProvince['prov-1']).toHaveLength(1);
  });

  /**
   * La que vigila el 429. Esto pedía los municipios **de una en una**, una
   * petición por provincia, y con la caché fría cada render las disparaba
   * todas. La API limita a 120 por minuto y todas las llamadas de servidor de
   * la tienda comparten cubo, así que unas pocas páginas por minuto bastaban
   * para empezar a recibir 429 — 1.615 en siete días de staging.
   *
   * Se cuenta por ruta a propósito: lo que no puede volver es una llamada por
   * provincia, y eso no se ve en el resultado, solo en cuántas veces se pidió.
   */
  it('los municipios se piden en una sola llamada, no una por provincia', async () => {
    const PROVINCIAS = Array.from({ length: 16 }, (_, i) => ({
      id: `prov-${i}`,
      name: `Provincia ${i}`,
    }));
    const MUNICIPIOS = PROVINCIAS.map((p, i) => ({
      id: `mun-${i}`,
      name: `Municipio ${i}`,
      provinceId: p.id,
    }));
    api.mockImplementation(async (ruta: string) =>
      ruta === '/provinces' ? { data: PROVINCIAS } : { data: MUNICIPIOS },
    );

    const catalogo = await getLocationCatalog();

    const rutas = api.mock.calls.map(([ruta]) => ruta as string);
    expect(rutas.filter((r) => r.includes('municipalities'))).toEqual([
      '/municipalities',
    ]);
    expect(rutas).toHaveLength(2);

    // Y cada provincia sigue trayendo lo suyo, agrupado por `provinceId`.
    expect(Object.keys(catalogo.municipalitiesByProvince)).toHaveLength(16);
    expect(catalogo.municipalitiesByProvince['prov-7']).toEqual([
      expect.objectContaining({ id: 'mun-7' }),
    ]);
  });

  /** Una provincia con cobertura pero sin municipios sigue trayendo lista. */
  it('la forma del catálogo no cambia: siempre hay lista por provincia', async () => {
    api.mockImplementation(async (ruta: string) =>
      ruta === '/provinces'
        ? { data: [PROVINCIA, { id: 'prov-2', name: 'Artemisa' }] }
        : { data: [MUNICIPIO] },
    );

    const catalogo = await getLocationCatalog();

    expect(catalogo.municipalitiesByProvince['prov-2']).toEqual([]);
  });

  it('un fallo no se queda pegado: la llamada siguiente vuelve a pedir', async () => {
    laApiParpadea();
    expect(await getProvinces()).toEqual([]);

    api.mockResolvedValue({ data: [PROVINCIA] });

    expect(await getProvinces()).toHaveLength(1);
  });
});
