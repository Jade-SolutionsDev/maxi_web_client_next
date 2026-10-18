/**
 * La clave que identifica **un intento de compra**, para que reintentarlo no
 * cree un segundo pedido (MxH-0176).
 *
 * La tienda se rinde a los 20 segundos, pero ese corte es solo de este lado: la
 * API sigue trabajando y el pedido puede existir igual. Si el cliente vuelve a
 * pulsar —que es lo que hace cualquiera— manda la misma clave y recibe el mismo
 * pedido.
 *
 * Dos propiedades, y la gracia está en que son contrarias:
 *
 *   - **sobrevive al reintento**, incluso recargando la página, porque esa es
 *     toda su razón de ser;
 *   - **no sobrevive a la compra siguiente**, o la segunda compra devolvería el
 *     pedido de la primera y el carrito nuevo se perdería en silencio.
 *
 * De ahí que se guarde en `sessionStorage` y se tire en cuanto el pedido se
 * crea.
 */

const CLAVE = 'maxi_intento_de_compra';

/** Sin `crypto.randomUUID` —contexto no seguro, navegador viejo— vale esto. */
const generar = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `intento-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

/**
 * La clave del intento en curso, creándola la primera vez.
 *
 * Si `sessionStorage` no está disponible —ventana privada, almacenamiento
 * bloqueado— se devuelve una clave nueva igualmente: se pierde la protección
 * entre recargas, pero no la del reintento dentro de la misma pantalla, que es
 * el caso frecuente. Nunca se deja caer la compra por esto.
 */
export const claveDelIntento = (): string => {
  try {
    const guardada = sessionStorage.getItem(CLAVE);
    if (guardada) return guardada;

    const nueva = generar();
    sessionStorage.setItem(CLAVE, nueva);
    return nueva;
  } catch {
    return generar();
  }
};

/**
 * Se llama **cuando el pedido ya existe**, no cuando se empieza a pagar: hasta
 * que no hay pedido, cualquier intento sigue siendo el mismo intento.
 */
export const olvidarElIntento = (): void => {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // Si no se puede borrar, la siguiente compra reutilizaría la clave y
    // recibiría el pedido anterior. Es el único caso malo de este módulo, y no
    // hay nada que hacer desde aquí: `sessionStorage` o está o no está, y si
    // leer funcionó, borrar también.
  }
};
