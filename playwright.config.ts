import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Las pruebas se escriben en Gherkin, en `e2e/features/`, para que se lean sin
 * saber Playwright. `bddgen` las traduce a specs antes de ejecutarlas; los
 * pasos viven en `e2e/steps/`.
 *
 * Usa el Chrome del sistema (`channel: 'chrome'`): no descarga navegadores.
 */
const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
  outputDir: 'e2e/.generado',
});

export default defineConfig({
  testDir,
  fullyParallel: false, // comparten base de datos: se pisarian
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    channel: 'chrome',
    headless: true,
    baseURL: 'http://localhost:3001',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'] } }],
});
