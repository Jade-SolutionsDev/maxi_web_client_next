import { describe, expect, it } from 'vitest';
import { fechaComprometida, plazoEnDiasHabiles } from './plazo';

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

describe('fechaComprometida', () => {
  it('lleva el día de la semana, que es la mitad útil del dato', () => {
    expect(fechaComprometida('2026-09-22T16:00:00Z')).toBe(
      'martes 22 de septiembre',
    );
  });

  it('no lleva año: un plazo de entrega no cae en otro', () => {
    expect(fechaComprometida('2026-09-22T16:00:00Z')).not.toContain('2026');
  });

  // El compromiso es del mostrador de La Habana. Las 01:30 UTC del 6 son las
  // 21:30 del 5 allí: sin fijar la zona, el mismo pedido sale con una fecha en
  // el servidor (UTC), otra en Madrid y otra en La Habana.
  it('se lee en hora de Cuba, no en la de quien abre la página', () => {
    expect(fechaComprometida('2026-10-06T01:30:00Z')).toBe(
      'lunes 5 de octubre',
    );
  });
});
