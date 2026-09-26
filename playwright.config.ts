import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

/**
 * Las pruebas se escriben en Gherkin, en `e2e/features/`, para que se lean sin
 * saber Playwright. `bddgen` las traduce a specs antes de ejecutarlas; los
 * pasos viven en `e2e/steps/`.
 *
 * Usa el Chrome del sistema (`channel: 'chrome'`): no descarga navegadores.
 */
const testDir = defineBddConfig({
  features: "e2e/features/**/*.feature",
  steps: "e2e/steps/**/*.ts",
  outputDir: "e2e/.generado",
});

export default defineConfig({
  testDir,
  globalSetup: "./e2e/setup/global.ts",
  fullyParallel: false, // comparten base de datos: se pisarian
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  // Contra un entorno desplegado la hidratacion tarda bastante mas que en un
  // servidor de desarrollo local, asi que los tiempos son ajustables.
  timeout: Number(process.env.E2E_TIMEOUT ?? 60_000),
  expect: { timeout: Number(process.env.E2E_TIMEOUT_EXPECT ?? 10_000) },
  use: {
    // El Chrome del sistema por defecto; en un servidor sin el, el Chromium
    // que trae Playwright (E2E_CANAL=chromium).
    channel: process.env.E2E_CANAL ?? "chrome",
    headless: true,
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3001",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    actionTimeout: Number(process.env.E2E_TIMEOUT_ACCION ?? 15_000),
  },
  projects: [
    // Inicia sesion una vez y deja la sesion en disco.
    {
      name: "acceso",
      testDir: "./e2e/setup",
      testMatch: /.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Escenarios de visitante: sin sesion, porque varios comprueban justo que
    // sin ella no se puede entrar a la cuenta.
    {
      name: "invitado",
      testDir,
      grepInvert: /@sesion/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Escenarios marcados con @sesion: reutilizan la sesion guardada.
    {
      name: "cliente",
      testDir,
      grep: /@sesion/,
      dependencies: ["acceso"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/cliente.json",
      },
    },
  ],
});
