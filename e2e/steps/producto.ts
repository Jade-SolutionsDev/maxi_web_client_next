import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { productoSembrado } from "../helpers";

const { When, Then } = createBdd();

/** La direccion canonica: el slug lleva el identificador pegado al final. */
const direccionDe = (nombre: string) => {
  const producto = productoSembrado(nombre);
  return `/catalog/${producto.slug}-${producto.id}`;
};

When(
  "el cliente abre la ficha de {string}",
  async ({ page }, nombre: string) => {
    await page.goto(direccionDe(nombre));
    // Esperar al titulo de la ficha, no solo a que `goto` vuelva: con el App
    // Router la respuesta llega antes que el contenido, y el paso siguiente
    // llegaba a leer todavia el h1 del catalogo («Descubre nuestros
    // productos»), que no es ningun producto sembrado.
    await expect(
      page.getByRole("heading", { level: 1, name: new RegExp(nombre, "i") }),
    ).toBeVisible({ timeout: 20_000 });
  },
);

When(
  "el cliente abre la ficha de {string} por su identificador",
  async ({ page }, nombre: string) => {
    // Los enlaces de antes del slug eran solo el identificador.
    await page.goto(`/catalog/${productoSembrado(nombre).id}`);
  },
);

When(
  "añade {int} unidades desde la ficha",
  async ({ page }, unidades: number) => {
    const producto = productoSembrado(await nombreEnCurso(page));
    const mas = page.getByRole("button", {
      name: `Agregar una unidad de ${producto.nombreReal}`,
    });
    /** El botón de añadir dice cuántas unidades lleva: es el contador visible. */
    const anadirCon = (cantidad: number) =>
      page.getByRole("button", { name: new RegExp(`añadir ${cantidad} `, "i") });

    /**
     * Pulsar y **comprobar que subió**, en vez de pulsar y seguir.
     *
     * El `+` vive en un componente de cliente. Hasta que React no engancha su
     * manejador, el botón ya está pintado, visible y habilitado —usa
     * `aria-disabled`, no `disabled`—, así que Playwright lo da por pulsable y
     * pulsa sobre algo que todavía no hace nada.
     *
     * No es una suposición: en el fallo del 8-oct-2026 el volcado marcaba ese
     * botón como `document.activeElement`, o sea que el clic llegó y lo dejó
     * enfocado, y la cantidad seguía en 1. Se descartó que fuera el tope
     * porque el `+` salía activo y el deshabilitado era el `−`.
     *
     * Se mira **antes** de pulsar para no pasarse: si la cantidad ya está, no
     * se vuelve a tocar. Y se reintenta acotado, no con una espera a ciegas:
     * si tras tres intentos no sube, es un fallo de verdad y la aserción lo
     * cuenta con el número que esperaba.
     */
    for (let cantidad = 2; cantidad <= unidades; cantidad++) {
      for (let intento = 1; intento <= 3; intento++) {
        if ((await anadirCon(cantidad).count()) > 0) break;
        await mas.click();
        await anadirCon(cantidad)
          .waitFor({ state: "visible", timeout: 5_000 })
          .catch(() => undefined);
      }
      await expect(anadirCon(cantidad)).toBeVisible({ timeout: 5_000 });
    }

    await anadirCon(unidades).click();
  },
);

/** El unico producto que la ficha muestra es el del titulo. */
async function nombreEnCurso(page: import("@playwright/test").Page) {
  const titulo = await page
    .getByRole("heading", { level: 1 })
    .first()
    .innerText();
  return titulo.replace(/ E2E \d+$/, "").trim();
}

Then("acaba en la dirección de {string}", async ({ page }, nombre: string) => {
  await expect(page).toHaveURL(new RegExp(`${direccionDe(nombre)}$`), {
    timeout: 15_000,
  });
});

Then("se le dice que la página no existe", async ({ page }) => {
  await expect(
    page.getByText(/404|no encontrad|no existe/i).first(),
  ).toBeVisible({
    timeout: 15_000,
  });
});
