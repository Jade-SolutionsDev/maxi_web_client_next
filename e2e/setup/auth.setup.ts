import { test as setup } from '@playwright/test';
import { iniciarSesion } from './acceso';

setup('iniciar sesión como cliente', async ({ page, context }) => {
  await iniciarSesion(page, context);
});
