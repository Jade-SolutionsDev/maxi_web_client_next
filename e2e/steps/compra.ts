import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { sembrarDireccion, sql } from "../helpers";

const { Given, When, Then } = createBdd();

const CORREO_CLIENTE = "qa.direcciones@maxihabana.com";

Given("que el cliente no tiene pedidos ni carrito", async () => {
  const cliente = `(SELECT id FROM clients WHERE email = '${CORREO_CLIENTE}')`;
  // En orden de dependencia: lo que cuelga del pedido antes que el pedido.
  sql(`DELETE FROM cart_items WHERE client_id IN ${cliente};
       DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM inventory_reservations WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM payment_charges WHERE order_id IN (SELECT id FROM orders WHERE client_id IN ${cliente});
       DELETE FROM orders WHERE client_id IN ${cliente}`);
});

Given("que el cliente tiene una dirección guardada", async () => {
  sembrarDireccion(CORREO_CLIENTE);
});

/**
 * El checkout ya no pide la direccion a mano: ofrece las guardadas del cliente
 * en la zona que esta mirando, con la predeterminada ya elegida. Este paso
 * comprueba justo eso — que aparece y viene marcada — en vez de escribirla.
 */
When("elige su dirección guardada", async ({ page }) => {
  // La predeterminada tiene que venir ya elegida, sin tocar nada.
  const elegida = page.getByRole("radio", { name: /predeterminada/i }).first();
  await expect(elegida).toBeChecked({ timeout: 20_000 });
});

/**
 * Desde MxH-0104 el checkout no deja pasar sin saber a quién se entrega. Una
 * dirección guardada los trae, así que este paso comprueba justo eso: que
 * vienen puestos sin teclear nada.
 */
Then("los datos de quien recibe vienen puestos", async ({ page }) => {
  await expect(page.getByLabel(/nombre y apellido/i)).toHaveValue(
    "Merlinda Vargas",
    { timeout: 20_000 },
  );
  await expect(page.getByLabel(/carnet de identidad/i)).toHaveValue(
    "85072045678",
  );
});

When("escribe los datos de quien recibe", async ({ page }) => {
  await page.getByLabel(/nombre y apellido/i).fill("Daniel Smith");
  await page.getByLabel(/carnet de identidad/i).fill("91031512345");
  await page.getByLabel(/tel[eé]fono de contacto/i).fill("55512345");
});

When("escribe un carnet imposible", async ({ page }) => {
  await page.getByLabel(/nombre y apellido/i).fill("Daniel Smith");
  // 30 de febrero: once dígitos y aun así no existe.
  await page.getByLabel(/carnet de identidad/i).fill("99023012345");
  await page.getByLabel(/tel[eé]fono de contacto/i).fill("55512345");
});

When("borra los datos de quien recibe", async ({ page }) => {
  await page.getByLabel(/nombre y apellido/i).fill("");
  await page.getByLabel(/carnet de identidad/i).fill("");
  await page.getByLabel(/tel[eé]fono de contacto/i).fill("");
});

When("pulsa confirmar el pedido", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar pedido/i }).click();
});

Then("el pedido no se crea", async ({ page }) => {
  await page.waitForTimeout(3000);
  expect(page.url()).not.toMatch(/\/pedidos\/[0-9a-f-]{36}/);
});

Then("se le dice que falta el carnet", async ({ page }) => {
  await expect(
    page
      .getByText(/11 d[ií]gitos y una fecha de nacimiento v[aá]lida/i)
      .first(),
  ).toBeVisible({ timeout: 15_000 });
});

Then("se le dice que falta el nombre", async ({ page }) => {
  await expect(
    page.getByText(/escribe el nombre y apellido/i).first(),
  ).toBeVisible({ timeout: 15_000 });
});

When("elige recoger en tienda", async ({ page }) => {
  await page
    .getByText(/recoger en tienda/i)
    .first()
    .click();
});

Then("también le piden quién recoge", async ({ page }) => {
  await expect(page.getByText(/datos del cliente/i).first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByLabel(/carnet de identidad/i)).toBeVisible();
});

/**
 * MxH-0099: desde el checkout se puede volver al catalogo a por mas cosas sin
 * que la compra se pierda por el camino.
 */
When("pulsa seguir comprando", async ({ page }) => {
  await page
    .getByRole("link", { name: /seguir comprando/i })
    .first()
    .click();
});

When("confirma el pedido", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar pedido/i }).click();
  // Al crearse, el pedido tiene pagina propia.
  await page.waitForURL(/\/pedidos\/[0-9a-f-]{36}/, { timeout: 30_000 });
});

When("abre su historial de pedidos", async ({ page }) => {
  await page.goto("/pedidos");
});

When("pulsa cancelar el pedido", async ({ page }) => {
  await page
    .getByRole("button", { name: /cancelar pedido/i })
    .first()
    .click();
});

When("confirma la cancelación", async ({ page }) => {
  const dialogo = page
    .locator("[role=dialog]")
    .filter({ hasText: /cancelar este pedido/i });
  await dialogo.getByRole("button", { name: /cancelar pedido/i }).click();
  await expect(dialogo).toBeHidden({ timeout: 15_000 });
});

Then("ve su pedido recién creado", async ({ page }) => {
  await expect(page.getByText(/ORD-\d+/).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then("el pedido está {string}", async ({ page }, estado: string) => {
  await expect(page.getByText(estado, { exact: true }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then("el pedido espera el pago", async ({ page }) => {
  await expect(page.getByText("Pago pendiente").first()).toBeVisible();
});

Then("el historial incluye ese pedido", async ({ page }) => {
  await expect(
    page.getByRole("list", { name: /historial de pedidos/i }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/ORD-\d+/).first()).toBeVisible();
});

Then("se le advierte que se libera el stock reservado", async ({ page }) => {
  await expect(page.getByText(/se libera el stock reservado/i)).toBeVisible();
});

Then("acaba en el catálogo", async ({ page }) => {
  await expect(page).toHaveURL(/\/catalog/, { timeout: 15_000 });
});

Then("ve cómo pagar el pedido", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /^Pago$/ })).toBeVisible({
    timeout: 15_000,
  });
});

When("elige recoger en el almacén", async ({ page }) => {
  await page
    .getByRole("tab", { name: /recoger/i })
    .or(page.getByText(/recoger en tienda/i))
    .first()
    .click();
  // El punto de recogida se elige solo cuando solo hay uno.
  await expect(page.getByText(/mostrador|recogida/i).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then("el envío no se cobra", async ({ page }) => {
  await expect(page.getByText(/gratis/i).first()).toBeVisible({
    timeout: 15_000,
  });
});
