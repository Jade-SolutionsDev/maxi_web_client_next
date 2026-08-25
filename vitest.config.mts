import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Los .spec.ts de e2e/ son de Playwright: vitest no debe tocarlos.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', '.next/**'],

    environment: 'jsdom',
  },
});
