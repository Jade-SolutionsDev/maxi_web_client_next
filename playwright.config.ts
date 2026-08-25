import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas del flujo real de Maxi: la administracion crea el catalogo, la API lo
 * sirve, y la tienda lo vende. Cruza los tres repositorios, por eso viven aqui
 * y no dentro de ninguno.
 *
 * Usa el Chrome instalado en el sistema (`channel: 'chrome'`) en vez de
 * descargar navegadores propios.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // comparten base de datos: se pisarian
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'] } }],
});
