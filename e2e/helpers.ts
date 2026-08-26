import { execFileSync } from 'node:child_process';

export const API = 'http://localhost:4000';
export const TIENDA = 'http://localhost:3001';

const CONTENEDOR = 'maxihabana-postgres-dev';
const BASE_DATOS = 'maxihabana';

/** Ejecuta SQL contra la base de desarrollo y devuelve las filas en texto. */
export function sql(consulta: string): string {
  const salida = execFileSync(
    'docker',
    [
      'exec',
      '-i',
      CONTENEDOR,
      'psql',
      '-U',
      'maxihabana',
      '-d',
      BASE_DATOS,
      '-qtAc',
      consulta,
    ],
    { encoding: 'utf8' },
  );

  // Un INSERT ... RETURNING devuelve el valor y ademas la linea "INSERT 0 1".
  // Nos quedamos con la primera linea util.
  return (
    salida
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^(INSERT|UPDATE|DELETE|SELECT) \d/.test(l))[0] ?? ''
  );
}

/** Invalida el cache del catalogo de la tienda, que dura un dia. */
export async function invalidarCatalogo(): Promise<void> {
  await fetch(`${TIENDA}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': 'change-me-in-production',
    },
    body: JSON.stringify({
      tags: ['taxonomy', 'taxonomy-tree', 'location-catalog', 'product-list'],
    }),
  });
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
  const salida = execFileSync(
    'docker',
    [
      'exec',
      '-i',
      CONTENEDOR,
      'psql',
      '-U',
      'maxihabana',
      '-d',
      BASE_DATOS,
      '-qtAc',
      consulta,
    ],
    { encoding: 'utf8' },
  );

  return salida
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^(INSERT|UPDATE|DELETE|SELECT) \d/.test(l));
}

/** Municipio cualquiera de una provincia con cobertura, para la cookie de zona. */
export function municipioConCobertura(): string {
  return sql(`
    SELECT m.id FROM municipalities m
     WHERE EXISTS (
       SELECT 1 FROM stock_location_coverage c
        JOIN stock_locations sl ON sl.id = c.location_id AND sl.is_active
       WHERE c.province_id = m.province_id)
     ORDER BY m.name LIMIT 1`);
}

/**
 * Cada escenario siembra con su propio sufijo, y limpia por el mismo sufijo al
 * terminar: asi dos escenarios no se pisan los datos.
 */
let sufijoActual = '';

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
  grupo = '',
) {
  const s = `${sufijo()}${grupo}`;
  const base = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
