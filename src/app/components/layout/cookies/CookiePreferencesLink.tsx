"use client";

import { EVENTO_ABRIR_COOKIES } from "./CookieNotice";

/**
 * No es un enlace a ninguna página: abre el panel donde esté montado. Va como
 * `button` y no como `a` porque no navega, y quien use lector de pantalla o
 * teclado tiene derecho a que el elemento diga lo que hace.
 */
export const CookiePreferencesLink = () => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_COOKIES))}
    className="w-fit rounded-sm text-left text-sm uppercase tracking-wide text-white/90 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
  >
    Configurar cookies
  </button>
);
