import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

const aviso = (page: import("@playwright/test").Page) =>
  page.getByRole("region", { name: /aviso de cookies/i });

Then("se le muestra el aviso de cookies", async ({ page }) => {
  await expect(aviso(page)).toBeVisible({ timeout: 20_000 });
});

/**
 * En la primera visita la tienda ya abre un dialogo bloqueante preguntando la
 * zona. Encimarle una barra deja al recien llegado con dos cosas que atender
 * antes de ver nada, asi que el aviso espera su turno.
 */
Then("todavía no se le muestra el aviso de cookies", async ({ page }) => {
  await page.waitForTimeout(2_000);
  await expect(aviso(page)).toHaveCount(0);
});

Then("ya no se le muestra el aviso de cookies", async ({ page }) => {
  await page.waitForTimeout(2_000);
  await expect(aviso(page)).toHaveCount(0);
});

Then("el aviso ofrece aceptar, rechazar y configurar", async ({ page }) => {
  const barra = aviso(page);
  await expect(barra.getByRole("button", { name: /^aceptar$/i })).toBeVisible();
  await expect(
    barra.getByRole("button", { name: /rechazar no necesarias/i }),
  ).toBeVisible();
  await expect(
    barra.getByRole("button", { name: /^configurar$/i }),
  ).toBeVisible();
});

When("acepta las cookies", async ({ page }) => {
  await aviso(page)
    .getByRole("button", { name: /^aceptar$/i })
    .click();
  await expect(aviso(page)).toHaveCount(0, { timeout: 20_000 });
});

When("rechaza las cookies no necesarias", async ({ page }) => {
  await aviso(page)
    .getByRole("button", { name: /rechazar no necesarias/i })
    .click();
  await expect(aviso(page)).toHaveCount(0, { timeout: 20_000 });
});

When("abre la configuración de cookies", async ({ page }) => {
  await aviso(page)
    .getByRole("button", { name: /^configurar$/i })
    .click();
});

When("abre la configuración de cookies desde el pie", async ({ page }) => {
  const enlace = page
    .getByRole("button", { name: /configurar cookies/i })
    .last();
  await enlace.scrollIntoViewIfNeeded();
  await enlace.click();
});

Then("el panel nombra las cookies que la tienda usa", async ({ page }) => {
  const panel = page
    .getByRole("dialog")
    .filter({ hasText: /configurar cookies/i });
  await expect(panel).toBeVisible({ timeout: 20_000 });
  // Las de verdad, no una lista de ejemplo: se comprobaron con el navegador.
  await expect(panel.getByText("maxi_location")).toBeVisible();
  await expect(panel.getByText(/__cf_bm/)).toBeVisible();
});

Then("las necesarias no se pueden desactivar", async ({ page }) => {
  const panel = page
    .getByRole("dialog")
    .filter({ hasText: /configurar cookies/i });
  await expect(panel.getByText(/siempre activas/i)).toBeVisible();
});
