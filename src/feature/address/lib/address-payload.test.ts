import { describe, expect, it } from 'vitest';
import type { AddressFormValues } from '../schema/address.schema';
import { toAddressPayload } from './address-payload';

const form: AddressFormValues = {
  label: '',
  street: 'Ave 51 #11025',
  betweenStreets: '',
  reference: '',
  provinceId: 'prov-1',
  municipalityId: 'mun-1',
  contactPhone: '',
};

const punto = {
  latitude: 23.102847,
  longitude: -82.409263,
  source: 'device' as const,
};

describe('toAddressPayload', () => {
  it('convierte las cadenas vacías en campos ausentes', () => {
    const payload = toAddressPayload(form);

    expect(payload.label).toBeUndefined();
    expect(payload.betweenStreets).toBeUndefined();
    expect(payload.contactPhone).toBeUndefined();
    expect(payload.street).toBe('Ave 51 #11025');
  });

  it('no manda la provincia: la API la deriva del municipio', () => {
    expect('provinceId' in toAddressPayload(form)).toBe(false);
  });

  describe('el punto en el mapa', () => {
    it('manda el punto cuando hay uno', () => {
      expect(toAddressPayload({ ...form, location: punto }).location).toEqual(
        punto,
      );
    });

    /**
     * **Esta es la prueba que justifica el módulo entero.**
     *
     * Todos los demás campos opcionales usan `valor || undefined`. Con ese
     * patrón, un `null` se convierte en ausencia, la API lo lee como «no toques
     * el punto» y quitar una ubicación deja de funcionar **sin que nada
     * falle**: el botón responde, el formulario se cierra, y el punto sigue ahí
     * al recargar. Es un fallo invisible, y por eso tiene prueba propia.
     */
    it('manda null tal cual, porque null es la orden de borrar', () => {
      const payload = toAddressPayload({ ...form, location: null });

      expect(payload.location).toBeNull();
      expect(payload.location).not.toBeUndefined();
    });

    it('omite el campo cuando el formulario no lo menciona', () => {
      // Editar la calle no puede borrar el punto: si el campo no viaja, la API
      // deja el que ya está.
      expect(toAddressPayload(form).location).toBeUndefined();
    });

    it('distingue las dos cosas, que es lo único que de verdad importa', () => {
      const borrar = toAddressPayload({ ...form, location: null });
      const noTocar = toAddressPayload(form);

      expect(borrar.location).not.toBe(noTocar.location);
      expect(JSON.stringify(borrar)).toContain('"location":null');
      expect(JSON.stringify(noTocar)).not.toContain('location');
    });
  });
});
