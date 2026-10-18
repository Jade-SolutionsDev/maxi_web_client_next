import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('server-only', () => ({}));

vi.mock('next/headers', () => ({ cookies: async () => store }));

import {
  clearMunicipalityId,
  writeMunicipalityId,
} from '@/shared/location/cookie/location.cookie';

describe('La cookie de zona se borra con el mismo nombre y ruta con que se escribe', () => {
  beforeEach(() => {
    store.set.mockClear();
    store.delete.mockClear();
  });

  it('la borra por nombre y ruta', async () => {
    await clearMunicipalityId();

    expect(store.delete).toHaveBeenCalledWith({
      name: 'maxi_location',
      path: '/',
    });
  });

  it('usa la ruta con la que se escribió', async () => {
    await writeMunicipalityId('mun-1');
    await clearMunicipalityId();

    const [nombre, , opciones] = store.set.mock.calls[0] as [
      string,
      string,
      { path: string },
    ];
    const [borrado] = store.delete.mock.calls[0] as [
      { name: string; path: string },
    ];

    expect(borrado.name).toBe(nombre);
    expect(borrado.path).toBe(opciones.path);
  });
});
