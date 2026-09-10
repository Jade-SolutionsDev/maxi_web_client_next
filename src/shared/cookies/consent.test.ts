import { describe, expect, it } from "vitest";
import {
  aceptaCategoria,
  CATEGORIAS,
  construirConsentimiento,
  leerConsentimiento,
  VERSION_CONSENTIMIENTO,
} from "./consent";

const guardado = (dato: unknown) => JSON.stringify(dato);

describe("leerConsentimiento", () => {
  it("lee una decisión válida", () => {
    const original = construirConsentimiento([]);

    expect(leerConsentimiento(guardado(original))).toEqual(original);
  });

  it.each([
    ["sin cookie", null],
    ["vacía", ""],
    ["que no es JSON", "esto no es json"],
    ["sin fecha", guardado({ version: VERSION_CONSENTIMIENTO, aceptadas: [] })],
    [
      "con las categorías en otra cosa que no es una lista",
      guardado({
        version: VERSION_CONSENTIMIENTO,
        fecha: "hoy",
        aceptadas: "todas",
      }),
    ],
  ])("trata como «sin respuesta» una cookie %s", (_, valor) => {
    expect(leerConsentimiento(valor as string | null)).toBeNull();
  });

  it("vuelve a preguntar cuando la lista declarada ha cambiado", () => {
    // Aceptar una lista no es aceptar otra: si sube la version, se pregunta.
    const viejo = guardado({
      version: VERSION_CONSENTIMIENTO - 1,
      fecha: new Date().toISOString(),
      aceptadas: [],
    });

    expect(leerConsentimiento(viejo)).toBeNull();
  });

  it("descarta categorías que no existen, en vez de fiarse de la cookie", () => {
    // La cookie la puede editar cualquiera desde el navegador: solo vale lo
    // que esta declarado en CATEGORIAS.
    const manipulada = guardado({
      version: VERSION_CONSENTIMIENTO,
      fecha: new Date().toISOString(),
      aceptadas: ["necesarias", "publicidad-inventada"],
    });

    expect(leerConsentimiento(manipulada)?.aceptadas).toEqual(["necesarias"]);
  });
});

describe("aceptaCategoria", () => {
  it("las necesarias valen siempre, incluso sin respuesta", () => {
    expect(aceptaCategoria(null, "necesarias")).toBe(true);
  });

  it("lo opcional no vale hasta que se acepta", () => {
    const sinAceptarNada = construirConsentimiento([]);

    expect(aceptaCategoria(sinAceptarNada, "analiticas")).toBe(false);
    expect(
      aceptaCategoria(construirConsentimiento(["analiticas"]), "analiticas"),
    ).toBe(true);
  });
});

describe("el inventario declarado", () => {
  it("no declara ninguna cookie sin decir quién la pone y cuánto dura", () => {
    for (const categoria of CATEGORIAS) {
      for (const cookie of categoria.cookies) {
        expect(cookie.nombre).toBeTruthy();
        expect(cookie.proveedor).toBeTruthy();
        expect(cookie.duracion).toBeTruthy();
        expect(cookie.proposito).toBeTruthy();
      }
    }
  });

  it("declara la propia cookie del consentimiento", () => {
    // Se escapa con facilidad, y es la unica que existe por culpa del aviso.
    const todas = CATEGORIAS.flatMap((c) => c.cookies.map((k) => k.nombre));

    expect(todas.some((n) => n.includes("maxi_cookies"))).toBe(true);
  });
});
