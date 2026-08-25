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
