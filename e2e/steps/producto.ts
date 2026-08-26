import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { productoSembrado } from '../helpers';

const { When, Then } = createBdd();

/** La direccion canonica: el slug lleva el identificador pegado al final. */
const direccionDe = (nombre: string) => {
  const producto = productoSembrado(nombre);
  return `/catalog/${producto.slug}-${producto.id}`;
};

When(
  'el cliente abre la ficha de {string}',
  async ({ page }, nombre: string) => {
    await page.goto(direccionDe(nombre));
  },
);

When(
  'el cliente abre la ficha de {string} por su identificador',
  async ({ page }, nombre: string) => {
    // Los enlaces de antes del slug eran solo el identificador.
    await page.goto(`/catalog/${productoSembrado(nombre).id}`);
  },
);

When(
  'añade {int} unidades desde la ficha',
  async ({ page }, unidades: number) => {
    const producto = productoSembrado(await nombreEnCurso(page));

    for (let i = 1; i < unidades; i++) {
      await page
        .getByRole('button', {
          name: `Agregar una unidad de ${producto.nombreReal}`,
        })
        .click();
    }

    await page
      .getByRole('button', { name: new RegExp(`añadir ${unidades} `, 'i') })
      .click();
  },
);

/** El unico producto que la ficha muestra es el del titulo. */
async function nombreEnCurso(page: import('@playwright/test').Page) {
  const titulo = await page
    .getByRole('heading', { level: 1 })
    .first()
    .innerText();
  return titulo.replace(/ E2E \d+$/, '').trim();
}

Then('acaba en la dirección de {string}', async ({ page }, nombre: string) => {
  await expect(page).toHaveURL(new RegExp(`${direccionDe(nombre)}$`), {
    timeout: 15_000,
  });
});

Then('se le dice que la página no existe', async ({ page }) => {
  await expect(
    page.getByText(/404|no encontrad|no existe/i).first(),
  ).toBeVisible({
    timeout: 15_000,
  });
});
