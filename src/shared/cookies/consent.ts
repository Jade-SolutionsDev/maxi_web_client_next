/**
 * Qué guarda la tienda en el dispositivo de quien la visita, y bajo qué
 * categoría.
 *
 * Es un inventario, no una plantilla: cada entrada se comprobó abriendo la
 * tienda con el navegador vacío y mirando qué aparecía. La tarjeta MxH-0106 lo
 * pide así —«solo deberán mostrarse las categorías que realmente sean
 * utilizadas»—, y una lista copiada de otro sitio sería justo lo contrario de
 * informar.
 *
 * **Hoy no hay analíticas ni publicidad.** El único dominio externo que la
 * tienda contacta es el de Clerk, que es quien gestiona las cuentas. Cuando
 * eso cambie, se añade la categoría aquí y el panel la muestra sola.
 */

export type CategoriaCookie = "necesarias" | "funcionales" | "analiticas";

export interface CookieDeclarada {
  nombre: string;
  proveedor: string;
  duracion: string;
  proposito: string;
}

export interface CategoriaDeclarada {
  id: CategoriaCookie;
  titulo: string;
  descripcion: string;
  /** Las necesarias no se pueden apagar: sin ellas la tienda no funciona. */
  obligatoria: boolean;
  cookies: CookieDeclarada[];
}

export const CATEGORIAS: CategoriaDeclarada[] = [
  {
    id: "necesarias",
    titulo: "Necesarias",
    descripcion:
      "Sin ellas la tienda no funciona: mantienen tu sesión, recuerdan la zona " +
      "desde la que compras y guardan tu carrito. No sirven para seguirte.",
    obligatoria: true,
    cookies: [
      {
        nombre: "__session, __client_uat, __clerk_db_jwt",
        proveedor: "Clerk",
        duracion: "Hasta 400 días",
        proposito: "Mantener tu sesión iniciada y saber si has entrado.",
      },
      {
        nombre: "__cf_bm, _cfuvid",
        proveedor: "Cloudflare, para Clerk",
        duracion: "30 minutos y la sesión",
        proposito:
          "Distinguir a una persona de un robot y evitar abusos contra el acceso.",
      },
      {
        nombre: "maxi_location",
        proveedor: "Maxi Habana",
        duracion: "30 días",
        proposito:
          "La zona que elegiste. Sin ella no podemos mostrarte qué hay disponible donde estás.",
      },
      {
        nombre: "cart-storage",
        proveedor: "Maxi Habana",
        duracion: "Hasta que vacíes el carrito",
        proposito:
          "Tu carrito antes de iniciar sesión, para que no se pierda al recargar.",
      },
      {
        nombre: "maxi_cookies",
        proveedor: "Maxi Habana",
        duracion: "180 días",
        proposito: "Recordar esta misma decisión y no volver a preguntarte.",
      },
    ],
  },
];

/** Solo lo que se puede elegir; hoy no hay nada, y el panel lo dice. */
export const CATEGORIAS_OPCIONALES = CATEGORIAS.filter((c) => !c.obligatoria);

/**
 * Sube cuando cambie lo que se declara. Un consentimiento guardado con una
 * versión anterior se vuelve a pedir: aceptar una lista ya no es aceptar otra.
 */
export const VERSION_CONSENTIMIENTO = 1;

export interface Consentimiento {
  version: number;
  /** ISO 8601. Sirve para poder demostrar cuándo se dio. */
  fecha: string;
  /** Categorías opcionales aceptadas. Las obligatorias no se listan. */
  aceptadas: CategoriaCookie[];
}

export const COOKIE_CONSENTIMIENTO = "maxi_cookies";

/** 180 días: se vuelve a preguntar cada medio año, sin ser molesto. */
export const MAX_AGE_CONSENTIMIENTO = 60 * 60 * 24 * 180;

export const construirConsentimiento = (
  aceptadas: CategoriaCookie[],
): Consentimiento => ({
  version: VERSION_CONSENTIMIENTO,
  fecha: new Date().toISOString(),
  aceptadas,
});

/**
 * Un consentimiento sirve si se entiende y si se dio sobre la lista actual.
 * Cualquier otra cosa —cookie manipulada, versión vieja— se trata como si no
 * hubiera respuesta, que es el lado seguro.
 */
export const leerConsentimiento = (
  valor: string | null | undefined,
): Consentimiento | null => {
  if (!valor) return null;

  try {
    const dato = JSON.parse(valor) as Partial<Consentimiento>;
    if (dato.version !== VERSION_CONSENTIMIENTO) return null;
    if (typeof dato.fecha !== "string") return null;
    if (!Array.isArray(dato.aceptadas)) return null;

    const validas = new Set(CATEGORIAS.map((c) => c.id));
    return {
      version: dato.version,
      fecha: dato.fecha,
      aceptadas: dato.aceptadas.filter((id): id is CategoriaCookie =>
        validas.has(id as CategoriaCookie),
      ),
    };
  } catch {
    return null;
  }
};

export const aceptaCategoria = (
  consentimiento: Consentimiento | null,
  categoria: CategoriaCookie,
): boolean => {
  const declarada = CATEGORIAS.find((c) => c.id === categoria);
  if (declarada?.obligatoria) return true;
  return consentimiento?.aceptadas.includes(categoria) ?? false;
};
