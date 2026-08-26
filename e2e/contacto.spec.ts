import { expect, test } from '@playwright/test';
import { sql, TIENDA } from './helpers';

const CORREO = `e2e-contacto-${Date.now()}@ejemplo.com`;

test.describe('Formulario de contacto', () => {
  test.afterAll(() => {
    sql(`DELETE FROM contact_messages WHERE email = '${CORREO}'`);
  });

  test('un visitante anónimo envía un mensaje y queda registrado', async ({
    page,
  }) => {
    await page.goto(`${TIENDA}/contacto`);

    await expect(
      page.getByRole('heading', { name: 'Envíanos un mensaje' }),
    ).toBeVisible();

    await page.getByLabel(/Motivo/).click();
    await page.getByRole('option', { name: 'Pedidos' }).click();
    await page.getByLabel(/Nombre/).fill('Prueba');
    await page.getByLabel(/Apellidos/).fill('Automatizada');
    await page.getByLabel(/Correo/).fill(CORREO);
    await page
      .getByLabel(/Mensaje/)
      .fill('Mensaje de prueba end to end para el formulario de contacto.');

    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(page.getByText('¡Mensaje enviado!')).toBeVisible();

    const estado = sql(
      `SELECT status FROM contact_messages WHERE email = '${CORREO}'`,
    );
    expect(estado).toBe('nuevo');
  });

  test('sin correo ni teléfono el formulario no se envía', async ({ page }) => {
    await page.goto(`${TIENDA}/contacto`);

    await page.getByLabel(/Motivo/).click();
    await page.getByRole('option', { name: 'Otro' }).click();
    await page.getByLabel(/Nombre/).fill('Prueba');
    await page.getByLabel(/Apellidos/).fill('SinContacto');
    await page
      .getByLabel(/Mensaje/)
      .fill('Mensaje sin ningún dato de contacto del remitente.');

    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(
      page.getByText('Dejanos un correo o un teléfono para responderte'),
    ).toBeVisible();
  });
});
