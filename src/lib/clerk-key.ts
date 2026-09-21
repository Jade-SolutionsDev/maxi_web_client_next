const NOMBRE_DE_LA_VARIABLE = 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY';
const DOMINIOS_DE_PRODUCCION = ['maxihabana.com', 'www.maxihabana.com'];

const esDeProduccion = (sitio: string | undefined): boolean => {
  if (!sitio) return false;

  try {
    return DOMINIOS_DE_PRODUCCION.includes(new URL(sitio).hostname);
  } catch {
    return false;
  }
};

export const revisarClaveDeClerk = ({
  clave,
  sitio,
}: {
  clave: string | undefined;
  sitio: string | undefined;
}): string | null => {
  if (!clave?.trim()) {
    return `Falta ${NOMBRE_DE_LA_VARIABLE}. Sin ella Clerk arranca en modo temporal y la tienda se queda sin sesión, sin poder entrar y sin poder pagar. Copia .env.example a .env.local y rellena la clave.`;
  }

  if (!clave.startsWith('pk_test_') && !clave.startsWith('pk_live_')) {
    return `${NOMBRE_DE_LA_VARIABLE} no parece una clave de Clerk: tiene que empezar por pk_test_ o pk_live_.`;
  }

  if (esDeProduccion(sitio) && clave.startsWith('pk_test_')) {
    return `${NOMBRE_DE_LA_VARIABLE} es una clave de pruebas y este build es el de producción (${sitio}). La API rechazaría cada token que emitiera la tienda.`;
  }

  return null;
};
