import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { sql } from '../helpers';

const { Given, When, Then } = createBdd();

const CORREO_CLIENTE = 'qa.direcciones@maxihabana.com';

Given('que el cliente no tiene pedidos ni carrito', async () => {
  const cliente = `(SELECT id FROM clients WHERE email = '${CORREO_CLIENTE}')`;
  // En orden de dependencia: lo que cuelga del pedido antes que el pedido.
  sql(`DELETE FROM cart_items WHERE client_id IN ${cliente};
       DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM inventory_reservations WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM payment_charges WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM orders WHERE client_id IN ${cliente}`);
});

When(
  'escribe {string} como dirección de entrega',
  async ({ page }, direccion: string) => {
    const campo = page.getByLabel(/dirección de entrega/i);
    await campo.waitFor({ state: 'visible', timeout: 15_000 });
    await campo.fill(direccion);
  },
);

When('confirma el pedido', async ({ page }) => {
  await page.getByRole('button', { name: /confirmar pedido/i }).click();
  // Al crearse, el pedido tiene pagina propia.
  await page.waitForURL(/\/pedidos\/[0-9a-f-]{36}/, { timeout: 30_000 });
});

When('abre su historial de pedidos', async ({ page }) => {
  await page.goto('/pedidos');
});

When('pulsa cancelar el pedido', async ({ page }) => {
  await page.getByRole('button', { name: /cancelar pedido/i }).first().click();
});

When('confirma la cancelación', async ({ page }) => {
  const dialogo = page.locator('[role=dialog]').filter({ hasText: /cancelar este pedido/i });
  await dialogo.getByRole('button', { name: /cancelar pedido/i }).click();
  await expect(dialogo).toBeHidden({ timeout: 15_000 });
});

Then('ve su pedido recién creado', async ({ page }) => {
  await expect(page.getByText(/ORD-\d+/).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('el pedido está {string}', async ({ page }, estado: string) => {
  await expect(page.getByText(estado, { exact: true }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('el pedido espera el pago', async ({ page }) => {
  await expect(page.getByText('Pago pendiente').first()).toBeVisible();
});

Then('el historial incluye ese pedido', async ({ page }) => {
  await expect(
    page.getByRole('list', { name: /historial de pedidos/i }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/ORD-\d+/).first()).toBeVisible();
});

Then('se le advierte que se libera el stock reservado', async ({ page }) => {
  await expect(page.getByText(/se libera el stock reservado/i)).toBeVisible();
});

Then('acaba en el catálogo', async ({ page }) => {
  await expect(page).toHaveURL(/\/catalog/, { timeout: 15_000 });
});
