import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import {
  municipiosSinEntrega,
  productoSembrado,
  provinciasConEntrega,
} from '../helpers';

const { Given, When, Then } = createBdd();

Given(
  'que el cliente tiene guardada una zona sin entrega',
  async ({ context }) => {
    /**
     * Es un estado al que se llega solo: la zona se guarda en una cookie que dura
     * meses, y los almacenes cambian de cobertura mientras tanto.
     */
    await context.addCookies([
      {
        name: 'maxi_location',
        value: municipiosSinEntrega(),
        domain: 'localhost',
        path: '/',
      },
    ]);
  },
);

When('abre el selector de zona', async ({ page }) => {
  await page
    .getByRole('button', { name: /cambiar ubicación/i })
    .first()
    .click();

  const dialogo = page
    .locator('[role=dialog]')
    .filter({ hasText: /dónde estás/i });
  await expect(dialogo).toBeVisible({ timeout: 15_000 });
  await dialogo.getByRole('combobox').first().click();
});

Then('solo puede elegir provincias con entrega', async ({ page }) => {
  const conEntrega = provinciasConEntrega();
  const ofrecidas = await page.getByRole('option').allInnerTexts();

  expect(ofrecidas.map((t) => t.trim()).sort()).toEqual([...conEntrega].sort());
});

When('busca {string} desde la cabecera', async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);
  const buscador = page.getByRole('searchbox', { name: /buscar productos/i });
  await buscador.fill(producto.nombreReal);
  await buscador.press('Enter');
  await expect(page).toHaveURL(/q=/, { timeout: 15_000 });
});
