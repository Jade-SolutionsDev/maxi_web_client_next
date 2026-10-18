import { describe, expect, it } from 'vitest';
import { AddressFormSchema } from './address.schema';

const valid = {
  label: 'Casa',
  street: 'Calle 23 #456',
  betweenStreets: '',
  reference: '',
  provinceId: 'prov-1',
  municipalityId: 'mun-1',
  contactPhone: '',
};

describe('AddressFormSchema', () => {
  it('accepts a form with only the required fields filled', () => {
    expect(AddressFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a blank street', () => {
    expect(
      AddressFormSchema.safeParse({ ...valid, street: '   ' }).success,
    ).toBe(false);
  });

  it('rejects a form with no municipality', () => {
    expect(
      AddressFormSchema.safeParse({ ...valid, municipalityId: '' }).success,
    ).toBe(false);
  });

  it('rejects a form with no province', () => {
    expect(
      AddressFormSchema.safeParse({ ...valid, provinceId: '' }).success,
    ).toBe(false);
  });

  it('rejects a phone that is not a plausible number', () => {
    expect(
      AddressFormSchema.safeParse({ ...valid, contactPhone: 'abc' }).success,
    ).toBe(false);
  });

  it('accepts a plausible Cuban phone', () => {
    expect(
      AddressFormSchema.safeParse({ ...valid, contactPhone: '+53 5251 9414' })
        .success,
    ).toBe(true);
  });

  // MxH-0072. El punto es opcional y, cuando viene, viene entero.
  describe('el punto en el mapa', () => {
    const punto = {
      latitude: 23.102847,
      longitude: -82.409263,
      source: 'device' as const,
    };

    it('acepta un formulario sin punto', () => {
      expect(AddressFormSchema.safeParse(valid).success).toBe(true);
    });

    it('acepta un punto completo', () => {
      expect(
        AddressFormSchema.safeParse({ ...valid, location: punto }).success,
      ).toBe(true);
    });

    it('acepta null, que es cómo se quita el punto', () => {
      const parsed = AddressFormSchema.safeParse({
        ...valid,
        location: null,
      });

      expect(parsed.success).toBe(true);
      // Y sobre todo: el null **sobrevive** al parseo. Si zod lo convirtiera en
      // ausencia, el borrado no llegaría nunca a la API.
      expect(parsed.success && parsed.data.location).toBeNull();
    });

    it('rechaza media coordenada', () => {
      expect(
        AddressFormSchema.safeParse({
          ...valid,
          location: { latitude: 23.102847, source: 'manual' },
        }).success,
      ).toBe(false);
    });

    it('rechaza un punto sin procedencia', () => {
      const { source: _fuera, ...sinProcedencia } = punto;

      expect(
        AddressFormSchema.safeParse({ ...valid, location: sinProcedencia })
          .success,
      ).toBe(false);
    });

    it.each([
      ['latitud fuera de rango', { ...punto, latitude: 91 }],
      ['longitud fuera de rango', { ...punto, longitude: -181 }],
      ['procedencia inventada', { ...punto, source: 'adivinada' }],
      ['coordenada como texto', { ...punto, latitude: '23.1' }],
    ])('rechaza %s', (_nombre, location) => {
      expect(AddressFormSchema.safeParse({ ...valid, location }).success).toBe(
        false,
      );
    });

    it.each([
      ['los polos', { latitude: 90, longitude: 0 }],
      ['el antimeridiano', { latitude: 0, longitude: 180 }],
    ])('acepta %s: el límite entra', (_nombre, coords) => {
      expect(
        AddressFormSchema.safeParse({
          ...valid,
          location: { ...coords, source: 'manual' as const },
        }).success,
      ).toBe(true);
    });
  });
});
