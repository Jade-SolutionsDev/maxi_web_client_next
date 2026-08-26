import { readFileSync } from 'node:fs';

/**
 * Clerk, por la puerta de atras. Sirve para dos cosas que el navegador no
 * puede hacer solo: dejar una cuenta lista antes de un escenario y borrarla
 * despues, para no ir dejando cuentas de prueba en la instancia.
 *
 * Los correos con `+clerk_test` son cuentas de prueba de Clerk: no se envia
 * ningun correo y el codigo de verificacion es siempre `424242`.
 */
export const CODIGO_DE_PRUEBA = '424242';

const API_CLERK = 'https://api.clerk.com/v1';

/**
 * La suite se lanza sin el entorno de la tienda, asi que lo lee de su
 * `.env.local`: las claves de Clerk son las mismas que usa la tienda contra la
 * que se prueba, y tenerlas duplicadas seria una forma segura de probar contra
 * otra instancia sin enterarse.
 */
export function cargarEntornoDeLaTienda() {
  for (const linea of readFileSync('.env.local', 'utf8').split('\n')) {
    const corte = linea.indexOf('=');
    if (corte < 1 || linea.startsWith('#')) continue;
    const nombre = linea.slice(0, corte).trim();
    if (!process.env[nombre])
      process.env[nombre] = linea.slice(corte + 1).trim();
  }
  // @clerk/testing espera este nombre, la tienda usa el publico de Next.
  process.env.CLERK_PUBLISHABLE_KEY ??=
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

function claveSecreta(): string {
  if (!process.env.CLERK_SECRET_KEY) cargarEntornoDeLaTienda();
  const clave = process.env.CLERK_SECRET_KEY;
  if (!clave) throw new Error('Falta CLERK_SECRET_KEY en .env.local');
  return clave;
}

async function pedir(ruta: string, init: RequestInit) {
  const res = await fetch(`${API_CLERK}${ruta}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${claveSecreta()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `Clerk ${init.method} ${ruta}: ${res.status} ${await res.text()}`,
    );
  }

  return res.json();
}

export function correoDePrueba(prefijo: string): string {
  return `${prefijo}+clerk_test@maxihabana.com`;
}

export async function crearCuenta(
  correo: string,
  clave: string,
): Promise<string> {
  const usuario = await pedir('/users', {
    method: 'POST',
    body: JSON.stringify({
      email_address: [correo],
      password: clave,
      first_name: 'QA',
      last_name: 'Temporal',
      skip_password_checks: true,
    }),
  });
  return usuario.id as string;
}

export async function borrarCuenta(id: string) {
  await pedir(`/users/${id}`, { method: 'DELETE' });
}

/** Todas las cuentas de prueba que quedaron de un escenario. */
export async function borrarCuentaPorCorreo(correo: string) {
  const encontrados = await pedir(
    `/users?email_address=${encodeURIComponent(correo)}`,
    { method: 'GET' },
  );
  for (const usuario of encontrados as { id: string }[]) {
    await borrarCuenta(usuario.id);
  }
}
