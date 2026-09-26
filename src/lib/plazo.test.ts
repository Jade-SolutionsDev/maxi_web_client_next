import { describe, expect, it } from 'vitest';
import { plazoEnDiasHabiles } from './plazo';

describe('plazoEnDiasHabiles', () => {
  // «3 días» se lee como tres días de calendario, y la API cuenta hábiles:
  // el cliente se hace una fecha que no es la que se le va a cumplir.
  it('dice que los días son hábiles', () => {
    expect(plazoEnDiasHabiles(3)).toBe('3 días hábiles');
  });

  it('concuerda en singular', () => {
    expect(plazoEnDiasHabiles(1)).toBe('1 día hábil');
  });
});
