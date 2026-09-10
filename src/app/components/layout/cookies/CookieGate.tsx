import { readConsentimiento } from "@/shared/cookies/cookie/consent.cookie";
import { CookieNotice } from "./CookieNotice";

/**
 * Decide en el servidor si hay que preguntar, para que el aviso no parpadee
 * en quien ya respondio.
 *
 * *Cuando* se muestra lo decide el propio aviso, en el cliente: en la primera
 * visita la tienda abre un dialogo bloqueante preguntando la zona, y
 * encimarle una barra deja al recien llegado con dos cosas que atender antes
 * de ver nada. Esa espera no puede vivir aqui porque el layout raiz no se
 * vuelve a pedir al elegir zona: el aviso llegaria tarde, en la navegacion
 * siguiente.
 */
export const CookieGate = async () => {
  const consentimiento = await readConsentimiento();

  return (
    <CookieNotice
      pendiente={consentimiento === null}
      aceptadas={consentimiento?.aceptadas ?? []}
    />
  );
};
