import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiAuth = vi.fn();

// El servicio es de servidor y `server-only` se niega a cargarse fuera de él.
vi.mock('server-only', () => ({}));
vi.mock('@/api/http', () => ({
  apiAuth: (...args: unknown[]) => apiAuth(...args),
}));

import {
  getSavedMunicipalityId,
  rememberMunicipality,
} from '@/shared/location/service/client-location.service';

const PLAZA = '5b41e0c7-9d38-4e26-8f1a-2c63b70d94ae';

/**
 * La zona guardada en la cuenta (MxH-0040).
 *
 * Lo que estas pruebas fijan es que **la cuenta nunca puede estropear la
 * compra**: quien entra sin sesión es la mayoría, y ahí `apiAuth` lanza. Si
 * ese lanzamiento saliera de aquí, tumbaría el selector de zona entero.
 */
describe('getSavedMunicipalityId', () => {
  beforeEach(() => {
    apiAuth.mockReset();
  });

  it('devuelve el municipio guardado', async () => {
    apiAuth.mockResolvedValue({ data: { municipalityId: PLAZA } });

    await expect(getSavedMunicipalityId()).resolves.toBe(PLAZA);
    expect(apiAuth).toHaveBeenCalledWith('/storefront/location');
  });

  it('devuelve null cuando el cliente no ha guardado ninguna', async () => {
    apiAuth.mockResolvedValue({ data: { municipalityId: null } });

    await expect(getSavedMunicipalityId()).resolves.toBeNull();
  });

  it('sin sesión devuelve null, no lanza', async () => {
    // El caso normal, no una avería: casi nadie navega con sesión iniciada.
    apiAuth.mockRejectedValue(new Error('SessionRequiredError'));

    await expect(getSavedMunicipalityId()).resolves.toBeNull();
  });

  it('si la API falla, tampoco lanza', async () => {
    apiAuth.mockRejectedValue(new Error('500'));

    await expect(getSavedMunicipalityId()).resolves.toBeNull();
  });
});

describe('rememberMunicipality', () => {
  beforeEach(() => {
    apiAuth.mockReset();
  });

  it('guarda la zona en la cuenta', async () => {
    apiAuth.mockResolvedValue({ data: { municipalityId: PLAZA } });

    await rememberMunicipality(PLAZA);

    expect(apiAuth).toHaveBeenCalledWith('/storefront/location', {
      method: 'PUT',
      body: { municipalityId: PLAZA },
    });
  });

  it('se traga el fallo: elegir zona no puede depender de esto', async () => {
    // Va después de escribir la cookie. Si lanzara, la acción caería en su
    // `catch` genérico y el cliente vería «No pudimos guardar tu ubicación»
    // con la ubicación ya guardada en el navegador.
    apiAuth.mockRejectedValue(new Error('500'));

    await expect(rememberMunicipality(PLAZA)).resolves.toBeUndefined();
  });
});
