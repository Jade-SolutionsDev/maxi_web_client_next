import { execFileSync } from "node:child_process";

/**
 * Todo lo que ata la suite a una maquina concreta sale de variables de
 * entorno, con los valores de desarrollo por defecto. Asi los mismos
 * escenarios se pueden correr contra un entorno desplegado sin tocar una
 * linea de codigo.
 */
/**
 * La raiz de la API, SIN el prefijo /api: quien la usa lo añade. Si la variable
 * ya lo trae —el guion del servidor la ponia asi— se le quita, o la peticion se
 * va a /api/api/... y contesta 404, que se lee igual que «no desplegado».
 */
export const API = (process.env.E2E_API ?? "http://localhost:4000").replace(
  /\/api\/?$/,
  "",
);
export const TIENDA = process.env.E2E_TIENDA ?? "http://localhost:3001";

/** Prefijo, no nombre exacto: en Swarm el sufijo de tarea cambia solo. */
const PREFIJO_CONTENEDOR =
  process.env.E2E_DB_CONTENEDOR ?? "maxihabana-postgres-dev";
const BASE_DATOS = process.env.E2E_DB_NOMBRE ?? "maxihabana";
const USUARIO_DB = process.env.E2E_DB_USUARIO ?? "maxihabana";
/**
 * Un guion propio que ya sabe a que base atacar, y al que solo se le pasan
 * los argumentos de `psql`. Existe porque `sudo` prohibe los comodines en los
 * argumentos de una regla, asi que no hay forma de permitir
 * `docker exec ... psql -c <consulta variable>` sin abrir la mano entera:
 * quien puede lanzar cualquier `docker` es root en la practica.
 *
 * Con esto el permiso se concede sobre un guion concreto, propiedad de root,
 * que lleva dentro el contenedor y la base. Tambien sirve donde no hay docker.
 */
const COMANDO_PROPIO = process.env.E2E_DB_COMANDO;

/** En un servidor `docker` suele necesitar sudo; en local no. */
const CON_SUDO = process.env.E2E_DB_SUDO === "1";
/**
 * El sello de sudo no se hereda al proceso hijo cuando hay `tty_tickets`.
 * `E2E_DB_CLAVE_SUDO` la pasa por la entrada estandar: nunca toca el disco ni
 * la linea de comandos, donde cualquiera la veria con `ps`.
 */
const CLAVE_SUDO = process.env.E2E_DB_CLAVE_SUDO;

const ejecutar = (orden: string, args: string[]): string => {
  if (!CON_SUDO) return execFileSync(orden, args, { encoding: "utf8" });
  if (CLAVE_SUDO) {
    return execFileSync("sudo", ["-S", "-p", "", orden, ...args], {
      encoding: "utf8",
      input: `${CLAVE_SUDO}\n`,
    });
  }
  return execFileSync("sudo", ["-n", orden, ...args], { encoding: "utf8" });
};

let contenedorResuelto: string | null = null;

function contenedor(): string {
  if (contenedorResuelto) return contenedorResuelto;
  const nombres = ejecutar("docker", ["ps", "--format", "{{.Names}}"])
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const hallado = nombres.find((n) => n.startsWith(PREFIJO_CONTENEDOR));
  if (!hallado) {
    throw new Error(
      `No hay ningun contenedor que empiece por "${PREFIJO_CONTENEDOR}"`,
    );
  }
  contenedorResuelto = hallado;
  return hallado;
}

/** Ejecuta SQL contra la base y devuelve las filas en texto. */
export function sql(consulta: string): string {
  return limpiar(consultar(consulta));
}

/**
 * Habla con la base, por el camino que toque. Todo lo que consulte tiene que
 * pasar por aqui: cuando `sql` y `sqlFilas` tenian cada una su propia copia,
 * adaptar una y olvidar la otra dejo media suite sin zona de entrega y con el
 * catalogo vacio, sin un solo error que lo dijera.
 */
function consultar(consulta: string): string {
  if (COMANDO_PROPIO) {
    // La variable trae el comando con sus opciones —"sudo -n /usr/local/..."—
    // y execFile no parte cadenas: hay que separarlas o busca un programa que
    // se llame igual que la linea entera.
    const [programa, ...previos] = COMANDO_PROPIO.trim().split(/\s+/);
    return execFileSync(programa, [...previos, "-qtAc", consulta], {
      encoding: "utf8",
    });
  }

  return ejecutar("docker", [
    "exec",
    "-i",
    contenedor(),
    "psql",
    "-U",
    USUARIO_DB,
    "-d",
    BASE_DATOS,
    "-qtAc",
    consulta,
  ]);
}

/**
 * Un INSERT ... RETURNING devuelve el valor y ademas la linea "INSERT 0 1".
 * Nos quedamos con la primera linea util.
 */
function limpiar(salida: string): string {
  return (
    salida
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !/^(INSERT|UPDATE|DELETE|SELECT) \d/.test(l))[0] ?? ""
  );
}

/**
 * Invalida el cache del catalogo de la tienda, que dura un dia.
 *
 * Y despues **se come una peticion**. La tienda sirve con
 * `stale-while-revalidate`: la primera visita tras invalidar devuelve lo viejo
 * y dispara la regeneracion en segundo plano; la siguiente ya trae lo nuevo.
 * Sin este sacrificio, el escenario que siembra y mira acto seguido no ve su
 * producto, y el fallo parece del catalogo. Tampoco depende del reloj, sino del
 * numero de visitas: por eso alguno pasaba aislado —el escenario anterior hacia
 * de calentamiento— y fallaba dentro del feature completo.
 *
 * La cookie es obligatoria: el arbol se guarda por municipio, y calentar sin
 * ella regenera otra entrada distinta de la que mira la prueba.
 */
export async function invalidarCatalogo(): Promise<void> {
  await fetch(`${TIENDA}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret":
        process.env.E2E_REVALIDATE_SECRET ?? "change-me-in-production",
    },
    body: JSON.stringify({
      tags: ["taxonomy", "taxonomy-tree", "location-catalog", "product-list"],
    }),
  });

  const municipio = municipioConCobertura();
  // Dos vueltas, no una: la primera se come lo viejo y dispara la regeneracion,
  // y la segunda espera a que haya terminado. Con una sola, el arbol de
  // departamentos ya salia bien pero la lista de productos seguia a medio
  // regenerar. Se lee el cuerpo entero en las dos: hasta que no se consume, la
  // tienda no ha acabado de servir.
  for (let vuelta = 0; vuelta < 2; vuelta += 1) {
    const respuesta = await fetch(`${TIENDA}/catalog`, {
      headers: { cookie: `maxi_location=${municipio}` },
    }).catch(() => null);
    await respuesta?.text();
    await new Promise((sigue) => setTimeout(sigue, 400));
  }
}

/** Un municipio al que no llega ningun almacen activo. */
export function municipiosSinEntrega(): string {
  return sql(`
    SELECT m.id FROM municipalities m
     WHERE NOT EXISTS (
       SELECT 1 FROM stock_location_coverage c
        JOIN stock_locations sl ON sl.id = c.location_id AND sl.is_active
       WHERE c.province_id = m.province_id)
     ORDER BY m.name LIMIT 1`);
}

/** Las provincias que hoy tiene cubiertas algun almacen activo. */
export function provinciasConEntrega(): string[] {
  const filas = sqlFilas(`
    SELECT p.name FROM provinces p
     WHERE EXISTS (
       SELECT 1 FROM stock_location_coverage c
        JOIN stock_locations sl ON sl.id = c.location_id AND sl.is_active
       WHERE c.province_id = p.id)
     ORDER BY p.name`);
  return filas;
}

/** Como `sql`, pero devuelve todas las filas y no solo la primera. */
export function sqlFilas(consulta: string): string[] {
  return consultar(consulta)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^(INSERT|UPDATE|DELETE|SELECT) \d/.test(l));
}

/**
 * El almacen donde siembran las pruebas: el mas antiguo activo. Vive aqui, y no
 * repetido en cada paso, porque la zona del escenario tiene que salir de este
 * mismo almacen.
 */
export const ALMACEN_DE_LAS_PRUEBAS = `
  SELECT id FROM stock_locations WHERE is_active ORDER BY created_at LIMIT 1`;

export function almacenDeLasPruebas(): string {
  return sql(ALMACEN_DE_LAS_PRUEBAS);
}

/**
 * Un municipio que cubra EL ALMACEN DONDE SE SIEMBRA, para la cookie de zona.
 *
 * Antes era «un municipio cualquiera de una provincia con cobertura», y con
 * varios almacenes eso separaba las dos mitades del escenario: las existencias
 * iban al mas antiguo —«Almacen Central La Habana», que solo cubre La Habana—
 * y la cookie se plantaba en Antilla, Holguin, el primero por orden alfabetico.
 * El escenario buscaba en Holguin un producto que solo existia en La Habana. En
 * una base con un solo almacen las dos consultas coinciden y no se nota.
 */
export function municipioConCobertura(): string {
  return sql(`
    SELECT m.id FROM municipalities m
     JOIN stock_location_coverage c ON c.province_id = m.province_id
     JOIN stock_locations sl ON sl.id = c.location_id AND sl.is_active
     WHERE sl.id = (${ALMACEN_DE_LAS_PRUEBAS})
     ORDER BY m.name LIMIT 1`);
}

/**
 * Cada escenario siembra con su propio sufijo, y limpia por el mismo sufijo al
 * terminar: asi dos escenarios no se pisan los datos.
 */
let sufijoActual = "";

export function nuevoSufijo(): string {
  sufijoActual = Date.now().toString().slice(-8);
  return sufijoActual;
}

export function sufijo(): string {
  return sufijoActual;
}

/** Lo sembrado en el escenario en curso, por el nombre con el que se pidio. */
export type ProductoSembrado = ReturnType<typeof sembrarProducto>;

const sembrados = new Map<string, ProductoSembrado>();

export function registrarProducto(nombre: string, dato: ProductoSembrado) {
  sembrados.set(nombre, dato);
  return dato;
}

export function productoSembrado(nombre: string): ProductoSembrado {
  const dato = sembrados.get(nombre);
  if (!dato)
    throw new Error(`El escenario no sembro ningun producto "${nombre}"`);
  return dato;
}

/** Para pasos que aceptan tanto un producto sembrado como un texto cualquiera. */
export function quizaSembrado(nombre: string): ProductoSembrado | undefined {
  return sembrados.get(nombre);
}

export function olvidarProductos() {
  sembrados.clear();
}

/**
 * Un producto nuevo en su propio departamento, para que cada escenario mire
 * solo lo suyo. El sufijo lo hace unico.
 */
export function sembrarProducto(
  nombre: string,
  rebaja: number,
  precio = 100,
  /** Sufijo extra: cada grupo crea su propio departamento. */
  grupo = "",
) {
  const s = `${sufijo()}${grupo}`;
  const base = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let categoria = sql(`SELECT id FROM categories WHERE slug = 'cat-e2e-${s}'`);
  if (!categoria) {
    const departamento = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Dep E2E ${s}', 'dep-e2e-${s}', NULL, 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
    categoria = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Cat E2E ${s}', 'cat-e2e-${s}', '${departamento}', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
  }
  const nombreReal = `${nombre} E2E ${s}`;
  const slug = `${base}-e2e-${s}`;
  const id = sql(`
    INSERT INTO products (category_id, sku, name, slug, measure_unit, base_price, discount, image_url)
    VALUES ('${categoria}', 'E2E-${s}-${base}', '${nombreReal}', '${slug}', 'unidad', ${precio}, ${rebaja}, 'https://placehold.co/600x400.png')
    RETURNING id`);
  return {
    id,
    slug,
    nombreReal,
    categoriaSlug: `cat-e2e-${s}`,
    categoriaNombre: `Cat E2E ${s}`,
    departamentoNombre: `Dep E2E ${s}`,
  };
}

/**
 * Una direccion guardada del cliente, en la zona que se esta mirando: el
 * checkout solo ofrece las direcciones de esa zona.
 */
export function sembrarDireccion(
  correoCliente: string,
  etiqueta = "Casa",
): string {
  const cliente = sql(
    `SELECT id FROM clients WHERE email = '${correoCliente}'`,
  );
  sql(`DELETE FROM client_addresses WHERE client_id = '${cliente}'`);
  return sql(`
    INSERT INTO client_addresses (client_id, label, street, municipality_id, is_default,
                                  recipient_name, id_card, contact_phone)
    VALUES ('${cliente}', '${etiqueta}', 'Calle 23 #456', '${municipioConCobertura()}', true,
            'Merlinda Vargas', '85072045678', '+53 5251 9414')
    RETURNING id`);
}
