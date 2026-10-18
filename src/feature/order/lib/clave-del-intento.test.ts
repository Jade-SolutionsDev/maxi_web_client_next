import { afterEach, describe, expect, it, vi } from 'vitest';
import { claveDelIntento, olvidarElIntento } from './clave-del-intento';

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('la clave del intento de compra', () => {
  it('devuelve la misma en dos llamadas seguidas', () => {
    // Es toda su razón de ser: el cliente que reintenta tras el corte por
    // tiempo tiene que mandar la misma clave.
    expect(claveDelIntento()).toBe(claveDelIntento());
  });

  it('sobrevive a recargar la página', () => {
    const primera = claveDelIntento();

    // Recargar es empezar de cero en memoria, no en `sessionStorage`.
    expect(sessionStorage.getItem('maxi_intento_de_compra')).toBe(primera);
    expect(claveDelIntento()).toBe(primera);
  });

  it('cambia después de olvidar el intento', () => {
    const primera = claveDelIntento();
    olvidarElIntento();
    const segunda = claveDelIntento();

    // Si no cambiara, la compra siguiente recibiría el pedido de la anterior y
    // el carrito nuevo se perdería sin que nadie avisara.
    expect(segunda).not.toBe(primera);
  });

  it('olvidar deja el almacenamiento limpio', () => {
    claveDelIntento();
    olvidarElIntento();

    expect(sessionStorage.getItem('maxi_intento_de_compra')).toBeNull();
  });

  it('tiene la forma que la API acepta', () => {
    // 16-64 caracteres, letras, dígitos, guion y guion bajo.
    expect(claveDelIntento()).toMatch(/^[A-Za-z0-9_-]{16,64}$/);
  });

  describe('sin sessionStorage', () => {
    const romperAlmacenamiento = () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('almacenamiento bloqueado');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('almacenamiento bloqueado');
      });
    };

    it('sigue dando una clave en vez de tumbar la compra', () => {
      // Ventana privada o almacenamiento bloqueado: se pierde la protección
      // entre recargas, no la compra.
      romperAlmacenamiento();

      expect(claveDelIntento()).toMatch(/^[A-Za-z0-9_-]{16,64}$/);
    });

    it('olvidar no revienta', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('almacenamiento bloqueado');
      });

      expect(() => olvidarElIntento()).not.toThrow();
    });
  });
});
