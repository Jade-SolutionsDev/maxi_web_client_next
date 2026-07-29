import { describe, expect, it } from 'vitest';
import { LocationFormSchema, SelectedMunicipalitySchema } from './location.schema';

const municipalityId = 'd856282a-b90d-46cd-9937-157cda0579e2';
const provinceId = 'f3f09219-18cc-44ec-b297-41853727c21e';

describe('SelectedMunicipalitySchema', () => {
  it('accepts a non-empty municipality id', () => {
    expect(SelectedMunicipalitySchema.safeParse({ municipalityId }).success).toBe(
      true,
    );
  });

  it('trims surrounding whitespace before validating', () => {
    const result = SelectedMunicipalitySchema.safeParse({
      municipalityId: `  ${municipalityId}  `,
    });

    expect(result.success && result.data.municipalityId).toBe(municipalityId);
  });

  it('rejects an empty string', () => {
    expect(
      SelectedMunicipalitySchema.safeParse({ municipalityId: '' }).success,
    ).toBe(false);
  });

  it('rejects a whitespace-only value', () => {
    expect(
      SelectedMunicipalitySchema.safeParse({ municipalityId: '   ' }).success,
    ).toBe(false);
  });

  it('rejects a missing field', () => {
    expect(SelectedMunicipalitySchema.safeParse({}).success).toBe(false);
  });

  it('rejects a non-string value', () => {
    expect(
      SelectedMunicipalitySchema.safeParse({ municipalityId: 42 }).success,
    ).toBe(false);
  });

  it('reports the municipality message when the value is empty', () => {
    const result = SelectedMunicipalitySchema.safeParse({ municipalityId: '' });
    const issue =
      !result.success &&
      result.error.issues.find((i) => i.path.includes('municipalityId'));

    expect(issue && issue.message).toBe('Elegí un municipio');
  });
});

describe('LocationFormSchema', () => {
  it('accepts a complete selection', () => {
    expect(
      LocationFormSchema.safeParse({ provinceId, municipalityId }).success,
    ).toBe(true);
  });

  it('rejects a selection without a province', () => {
    expect(
      LocationFormSchema.safeParse({ provinceId: '', municipalityId }).success,
    ).toBe(false);
  });

  it('rejects a selection without a municipality', () => {
    expect(
      LocationFormSchema.safeParse({ provinceId, municipalityId: '' }).success,
    ).toBe(false);
  });

  it('reports the province message when the province is empty', () => {
    const result = LocationFormSchema.safeParse({
      provinceId: '',
      municipalityId,
    });
    const issue =
      !result.success &&
      result.error.issues.find((i) => i.path.includes('provinceId'));

    expect(issue && issue.message).toBe('Elegí una provincia');
  });
});
