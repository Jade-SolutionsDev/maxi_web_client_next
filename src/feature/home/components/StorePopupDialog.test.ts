import { describe, expect, it } from 'vitest';
import { debeVerse } from './StorePopupDialog';

const HORA = 3600 * 1000;
const ahora = Date.UTC(2026, 9, 18, 12, 0, 0);

const aviso = (
  cambios: Partial<{ version: string; repeatAfterHours: number | null }> = {},
) => ({
  version: 'v1',
  repeatAfterHours: null,
  ...cambios,
});

describe('cuándo vuelve a verse el aviso', () => {
  it('a quien no lo ha cerrado, se le enseña', () => {
    expect(debeVerse(aviso(), null, ahora)).toBe(true);
  });

  it('a quien lo cerró no se le repite en cada carga', () => {
    // El fallo clásico de estos avisos: salir otra vez al navegar.
    const cierre = { version: 'v1', at: ahora - 60 * 1000 };

    expect(debeVerse(aviso(), cierre, ahora)).toBe(false);
  });

  it('si el aviso cambia, vuelve a salir aunque lo hubieran cerrado', () => {
    const cierre = { version: 'v1', at: ahora - 60 * 1000 };

    expect(debeVerse(aviso({ version: 'v2' }), cierre, ahora)).toBe(true);
  });

  it('con repetición a las 24 horas, respeta el plazo', () => {
    const cierre = { version: 'v1', at: ahora - 23 * HORA };
    expect(debeVerse(aviso({ repeatAfterHours: 24 }), cierre, ahora)).toBe(
      false,
    );

    const viejo = { version: 'v1', at: ahora - 25 * HORA };
    expect(debeVerse(aviso({ repeatAfterHours: 24 }), viejo, ahora)).toBe(true);
  });

  it('sin repetición configurada, no vuelve nunca con el mismo contenido', () => {
    const cierre = { version: 'v1', at: ahora - 365 * 24 * HORA };

    expect(debeVerse(aviso({ repeatAfterHours: null }), cierre, ahora)).toBe(
      false,
    );
  });
});
