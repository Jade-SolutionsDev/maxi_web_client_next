"use server";

import { revalidatePath } from "next/cache";
import {
  type CategoriaCookie,
  CATEGORIAS,
  construirConsentimiento,
} from "../consent";
import { writeConsentimiento } from "../cookie/consent.cookie";

const validas = new Set(
  CATEGORIAS.filter((c) => !c.obligatoria).map((c) => c.id),
);

/**
 * Guarda la decisión. Solo se admiten categorías declaradas y opcionales: una
 * obligatoria no se "acepta", se usa siempre, y aceptar algo que no existe no
 * significa nada.
 */
export const guardarConsentimiento = async (
  aceptadas: string[],
): Promise<{ ok: true }> => {
  const limpias = aceptadas.filter((id): id is CategoriaCookie =>
    validas.has(id as CategoriaCookie),
  );

  await writeConsentimiento(construirConsentimiento(limpias));

  revalidatePath("/", "layout");

  return { ok: true };
};
