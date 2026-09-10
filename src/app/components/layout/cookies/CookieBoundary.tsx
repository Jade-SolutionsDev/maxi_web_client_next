import { Suspense } from "react";
import { CookieGate } from "./CookieGate";

/**
 * Leer cookies en el servidor bloquea el pintado de toda la ruta si no hay un
 * limite de Suspense por encima; Next avisa de ello explicitamente. El aviso
 * de cookies no vale un retraso en el resto de la pagina, asi que llega
 * cuando llegue y mientras tanto no se ve nada, que es exactamente lo que se
 * quiere: no hay hueco que reservar en el layout.
 *
 * Mismo patron que `LocationBoundary`.
 */
export const CookieBoundary = () => (
  <Suspense fallback={null}>
    <CookieGate />
  </Suspense>
);
