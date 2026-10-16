/**
 * Una ficha de producto termina **siempre** en su identificador:
 * `/catalog/<slug>-<uuid>`. Lo arma `buildProductDetailHref`, y cuando el slug
 * viene vacío queda `/catalog/<uuid>` — también acaba en identificador.
 *
 * Así que una dirección de ficha que no acabe en uno **no puede existir**, y
 * eso se sabe sin preguntarle a la API. Vive aparte del middleware para que la
 * prueba pueda comprobar que esta forma y la que construye los enlaces no se
 * separan con el tiempo.
 */
const TRAILING_UUID =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** `/catalog/<algo>`, con o sin barra final. Ni `/catalog` ni rutas más hondas. */
const FICHA = /^\/catalog\/([^/]+)\/?$/;

export const esFichaImposible = (pathname: string): boolean => {
  const encontrado = pathname.match(FICHA);
  if (!encontrado) return false;

  let segmento = encontrado[1];
  try {
    segmento = decodeURIComponent(segmento);
  } catch {
    // Un `%` suelto no se puede descodificar, y tampoco puede ser una ficha.
    return true;
  }

  return !TRAILING_UUID.test(segmento);
};
