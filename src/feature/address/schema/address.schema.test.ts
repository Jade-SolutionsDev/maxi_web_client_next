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
    expect(AddressFormSchema.safeParse({ ...valid, street: '   ' }).success).toBe(false);
  });

  it('rejects a form with no municipality', () => {
    expect(AddressFormSchema.safeParse({ ...valid, municipalityId: '' }).success).toBe(false);
  });

  it('rejects a form with no province', () => {
    expect(AddressFormSchema.safeParse({ ...valid, provinceId: '' }).success).toBe(false);
  });

  it('rejects a phone that is not a plausible number', () => {
    expect(AddressFormSchema.safeParse({ ...valid, contactPhone: 'abc' }).success).toBe(false);
  });

  it('accepts a plausible Cuban phone', () => {
    expect(AddressFormSchema.safeParse({ ...valid, contactPhone: '+53 5551 2345' }).success).toBe(true);
  });
});
