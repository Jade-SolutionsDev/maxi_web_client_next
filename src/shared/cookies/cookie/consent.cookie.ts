import "server-only";

import { cookies } from "next/headers";
import {
  COOKIE_CONSENTIMIENTO,
  type Consentimiento,
  leerConsentimiento,
  MAX_AGE_CONSENTIMIENTO,
} from "../consent";

export const readConsentimiento = async (): Promise<Consentimiento | null> => {
  const almacen = await cookies();

  return leerConsentimiento(almacen.get(COOKIE_CONSENTIMIENTO)?.value);
};

/**
 * `httpOnly: false` a propósito, al contrario que el resto: el propio
 * navegador tiene que poder leer la decisión antes de cargar nada opcional.
 * No guarda nada privado —una versión, una fecha y una lista de categorías—.
 */
export const writeConsentimiento = async (
  consentimiento: Consentimiento,
): Promise<void> => {
  const almacen = await cookies();

  almacen.set(COOKIE_CONSENTIMIENTO, JSON.stringify(consentimiento), {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_CONSENTIMIENTO,
  });
};
