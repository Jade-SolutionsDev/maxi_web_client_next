import { beforeEach, describe, expect, it, vi } from 'vitest';

const writeMunicipalityId = vi.fn();
const readMunicipalityId = vi.fn(async () => null as string | null);
const clearMunicipalityId = vi.fn();
const rememberMunicipality = vi.fn(async (_municipalityId: string) => {});
const revalidatePath = vi.fn();

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));
vi.mock('../cookie/location.cookie', () => ({
  writeMunicipalityId: (...a: unknown[]) => writeMunicipalityId(...a),
  readMunicipalityId: () => readMunicipalityId(),
  clearMunicipalityId: () => clearMunicipalityId(),
}));
vi.mock('../service/client-location.service', () => ({
  rememberMunicipality: (id: string) => rememberMunicipality(id),
}));

const HABANA = 'f3f09219-18cc-44ec-b297-41853727c21e';
const PLAZA = '5b41e0c7-9d38-4e26-8f1a-2c63b70d94ae';

vi.mock('../service/location.service', () => ({
  getLocationCatalog: async () => ({
    provinces: [{ id: HABANA, name: 'La Habana' }],
    municipalitiesByProvince: {
      [HABANA]: [
        { id: PLAZA, name: 'Plaza de la Revolución', provinceId: HABANA },
      ],
    },
  }),
}));

import { saveLocation } from '@/shared/location/action/location.action';

/**
 * Elegir zona escribe en dos sitios (MxH-0040): la **cookie**, que es lo que
 * filtra el catálogo de este navegador, y la **cuenta**, para no volver a
 * preguntarla en otro dispositivo.
 *
 * El orden y la tolerancia al fallo son el asunto: la cuenta va después y no
 * puede tumbar nada.
 */
describe('saveLocation', () => {
  beforeEach(() => {
    writeMunicipalityId.mockClear();
    rememberMunicipality.mockClear().mockResolvedValue(undefined);
    revalidatePath.mockClear();
    readMunicipalityId.mockResolvedValue(null);
  });

  it('guarda la zona en la cookie y en la cuenta', async () => {
    const result = await saveLocation({ municipalityId: PLAZA });

    expect(result.error).toBeUndefined();
    expect(writeMunicipalityId).toHaveBeenCalledWith(PLAZA);
    expect(rememberMunicipality).toHaveBeenCalledWith(PLAZA);
  });

  it('un municipio que no está en el catálogo no se guarda en ninguno', async () => {
    const result = await saveLocation({ municipalityId: HABANA });

    expect(result.error).toBe('Esa ubicación no está disponible');
    expect(writeMunicipalityId).not.toHaveBeenCalled();
    expect(rememberMunicipality).not.toHaveBeenCalled();
  });

  it('si la cuenta falla, la zona queda elegida igual', async () => {
    // Lo contrario sería lo peor de los dos mundos: la cookie ya escrita y el
    // cliente leyendo «No pudimos guardar tu ubicación».
    rememberMunicipality.mockRejectedValue(new Error('500'));

    const result = await saveLocation({ municipalityId: PLAZA });

    expect(result.error).toBeUndefined();
    expect(writeMunicipalityId).toHaveBeenCalledWith(PLAZA);
  });
});
