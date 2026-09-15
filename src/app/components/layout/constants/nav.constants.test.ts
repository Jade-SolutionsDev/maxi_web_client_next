import { describe, expect, it } from "vitest";
import {
  FAQ_HREF,
  navItems,
  sheetNavItems,
  visibleNavItems,
} from "./nav.constants";

describe("navegación de la tienda", () => {
  it("incluye Preguntas frecuentes en la navegación principal y móvil", () => {
    const faqItem = navItems.find(
      ({ href }) => href === "/preguntas-frecuentes",
    );

    expect(faqItem).toMatchObject({ label: "Preguntas frecuentes" });
    expect(sheetNavItems).toContainEqual(faqItem);
  });

  it("oculta Preguntas frecuentes cuando no hay nada publicado", () => {
    const hidden = visibleNavItems(navItems, { showFaq: false });
    expect(hidden.some(({ href }) => href === FAQ_HREF)).toBe(false);
    expect(hidden).toHaveLength(navItems.length - 1);
  });

  it("mantiene Preguntas frecuentes cuando hay contenido", () => {
    expect(visibleNavItems(navItems, { showFaq: true })).toEqual(navItems);
  });
});
