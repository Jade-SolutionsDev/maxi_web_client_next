import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { API, invalidarCatalogo, municipioConCobertura, sql } from '../helpers';

const { Given, When, Then, Before, After } = createBdd();

/**
 * Estado compartido entre los pasos de un escenario. Es seguro tenerlo en el
 * modulo porque la suite corre en serie (`workers: 1`): los escenarios no se
 * solapan.
 */
type Estado = {
  sufijo: string;
  productos: Map<
    string,
    {
      slug: string;
      nombreReal: string;
      categoriaSlug: string;
      categoriaNombre: string;
      departamentoNombre: string;
    }
  >;
  paginaCms?: { slug: string; titulo: string; contenido: string };
  respuestaApi?: { items: Array<Record<string, unknown>> };
  ultimoEstadoHttp?: number;
  avisoDeAñadido?: boolean;
};

let estado: Estado;

Before(() => {
  estado = { sufijo: Date.now().toString().slice(-8), productos: new Map() };
});

After(async () => {
  // Cada escenario se lleva lo que sembro.
  sql(
    `DELETE FROM inventory WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%')`,
  );
  sql(`DELETE FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%'`);
  sql(`DELETE FROM categories WHERE slug LIKE '%-e2e-${estado.sufijo}'`);
  sql(`DELETE FROM cms_pages WHERE slug = 'pagina-e2e-${estado.sufijo}'`);

  /**
   * Y se invalida el cache: la tienda guarda el catalogo un dia entero, asi que
   * borrar de la base no basta. Sin esto, escenarios posteriores ven productos
   * que ya no existen.
   */
  await invalidarCatalogo();
});

// ---------------------------------------------------------------- Antecedentes

Given('que el cliente ha elegido una zona con entrega', async ({ context }) => {
  await context.addCookies([
    {
      name: 'maxi_location',
      value: municipioConCobertura(),
      domain: 'localhost',
      path: '/',
    },
  ]);
});

Given('que el cliente no ha elegido zona', async ({ context }) => {
  await context.clearCookies();
});

Given(
  'que existe un producto {string} con {int} unidades y un {int}% de rebaja',
  async ({}, nombre: string, unidades: number, rebaja: number) => {
    const sembrado = sembrarProducto(nombre, rebaja);
    const almacen = sql(
      'SELECT id FROM stock_locations WHERE is_active ORDER BY created_at LIMIT 1',
    );
    sql(
      `INSERT INTO inventory (location_id, product_id, quantity) VALUES ('${almacen}', '${sembrado.id}', ${unidades})`,
    );
    estado.productos.set(nombre, sembrado);
    await invalidarCatalogo();
  },
);

Given(
  'que existe un producto {string} sin existencias',
  async ({}, nombre: string) => {
    estado.productos.set(nombre, sembrarProducto(nombre, 0));
    await invalidarCatalogo();
  },
);

function sembrarProducto(nombre: string, rebaja: number) {
  const s = estado.sufijo;
  const base = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let categoria = sql(`SELECT id FROM categories WHERE slug = 'cat-e2e-${s}'`);
  if (!categoria) {
    const departamento = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Dep E2E ${s}', 'dep-e2e-${s}', NULL, 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
    categoria = sql(`
      INSERT INTO categories (name, slug, parent_id, image_desktop_url, image_mobile_url)
      VALUES ('Cat E2E ${s}', 'cat-e2e-${s}', '${departamento}', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png')
      RETURNING id`);
  }
  const nombreReal = `${nombre} E2E ${s}`;
  const slug = `${base}-e2e-${s}`;
  const id = sql(`
    INSERT INTO products (category_id, sku, name, slug, measure_unit, base_price, discount, image_url)
    VALUES ('${categoria}', 'E2E-${s}-${base}', '${nombreReal}', '${slug}', 'unidad', 100, ${rebaja}, 'https://placehold.co/600x400.png')
    RETURNING id`);
  return {
    id,
    slug,
    nombreReal,
    categoriaSlug: `cat-e2e-${s}`,
    categoriaNombre: `Cat E2E ${s}`,
    departamentoNombre: `Dep E2E ${s}`,
  };
}

// ------------------------------------------------------------------- Acciones

When('el cliente abre el catálogo', async ({ page }) => {
  await page.goto('/catalog');
});

When('el cliente abre {string}', async ({ page }, ruta: string) => {
  const res = await page.goto(ruta);
  estado.ultimoEstadoHttp = res?.status();
});

When('pulsa sobre el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await page.getByText(producto!.nombreReal).first().click();
});

When(
  'el cliente busca {string} en el catálogo',
  async ({ page }, termino: string) => {
    const producto = estado.productos.get(termino);
    const texto = producto ? producto.nombreReal : termino;
    await page.goto(`/catalog?q=${encodeURIComponent(texto)}`);
  },
);

When('se consultan los productos públicos de la API', async ({ request }) => {
  const res = await request.get(`${API}/api/public/products`);
  expect(res.status()).toBe(200);
  estado.respuestaApi = (await res.json()).data;
});

// ---------------------------------------------------------- Comprobaciones

Then('ve el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await expect(page.getByText(producto!.nombreReal).first()).toBeVisible();
});

Then('no ve el producto {string}', async ({ page }, nombre: string) => {
  const producto = estado.productos.get(nombre);
  await expect(page.getByText(producto!.nombreReal)).toHaveCount(0);
});

Then('ve el precio {string}', async ({ page }, precio: string) => {
  await expect(page.getByText(precio, { exact: false }).first()).toBeVisible();
});

Then('la página sigue funcionando', async ({ page }) => {
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.getByText('Algo salió mal')).toHaveCount(0);
});

Then('la respuesta incluye {string}', async ({}, nombre: string) => {
  const producto = estado.productos.get(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).toContain(producto!.nombreReal);
});

Then('la respuesta no incluye {string}', async ({}, nombre: string) => {
  const producto = estado.productos.get(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).not.toContain(producto!.nombreReal);
});

Then(
  '{string} tiene precio base {int}, rebaja {int} y precio final {int}',
  async ({}, nombre: string, base: number, rebaja: number, final: number) => {
    const producto = estado.productos.get(nombre);
    const item = estado.respuestaApi!.items.find(
      (p) => p.name === producto!.nombreReal,
    );
    expect(item).toBeDefined();
    expect(item!.basePrice).toBe(base);
    expect(item!.discount).toBe(rebaja);
    expect(item!.finalPrice).toBe(final);
  },
);

Then(
  'la página muestra el título {string}',
  async ({ page }, titulo: string) => {
    await expect(
      page.getByRole('heading', { name: titulo, level: 1 }),
    ).toBeVisible();
  },
);

Then('acaba en la pantalla de acceso', async ({ page }) => {
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole('heading', { name: 'Iniciar sesión' }),
  ).toBeVisible();
});

Then('la respuesta es un 404', async ({ page }) => {
  expect(estado.ultimoEstadoHttp).toBe(404);
  await expect(page.getByText('404').first()).toBeVisible();
});

Then(
  'la portada muestra las secciones de destacados, ofertas y recientes',
  async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Productos destacados' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'En oferta' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Nuestros productos más recientes' }),
    ).toBeVisible();
  },
);

Then('se le pide que elija su zona', async ({ page }) => {
  await expect(page.getByText('¿Dónde estás?')).toBeVisible();
});

Then('no se le pide que elija su zona', async ({ page }) => {
  await expect(page.getByText('¿Dónde estás?')).toHaveCount(0);
});

Then('la cabecera muestra su zona', async ({ page }) => {
  await expect(page.getByText('Disponible en:')).toBeVisible();
});

// ---------------------------------------------------------------- El carrito

When('añade el primer producto al carrito', async ({ page }) => {
  // Cuantas unidades hay antes, para esperar a que suban de verdad.
  const antes = await unidadesEnCarrito(page);

  const boton = page.getByRole('button', { name: /^a[ñn]adir/i }).first();
  // El catalogo puede tardar en pintar sus tarjetas; sin esta espera el aviso
  // se pierde entre la carga y el clic.
  await boton.waitFor({ state: 'visible', timeout: 15_000 });
  await boton.scrollIntoViewIfNeeded();
  await boton.hover();
  /**
   * El carrito hidrata despues de pintar la pagina, y el anunciador toma el
   * primer estado que ve como "el de partida": si se pulsa antes de eso, el
   * aviso de producto añadido no llega a emitirse.
   */
  await page.waitForTimeout(600);

  await boton.click();

  // El aviso se desvanece solo, asi que se anota aqui, en el instante en que
  // aparece. Comprobarlo mas tarde seria una carrera perdida.
  // `isVisible()` no espera: devuelve el estado de ese instante. Hay que
  // esperar de verdad a que el aviso aparezca.
  estado.avisoDeAñadido = await page
    .getByText(/producto añadido al carrito/i)
    .first()
    .waitFor({ state: 'visible', timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  /**
   * No se espera al aviso: es un toast que se desvanece, y usarlo para
   * sincronizar hace que la prueba falle segun lo rapida que vaya la maquina.
   * Se espera al estado guardado, que es lo que de verdad importa.
   */
  await expect
    .poll(() => unidadesEnCarrito(page), { timeout: 10_000 })
    .toBeGreaterThan(antes);
});

/** Unidades guardadas hoy en el carrito de invitado (localStorage). */
async function unidadesEnCarrito(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    try {
      const crudo = localStorage.getItem('cart-storage');
      if (!crudo) return 0;
      const datos = JSON.parse(crudo);
      const lineas =
        datos?.state?.lines ?? datos?.state?.items ?? datos?.lines ?? [];
      return lineas.reduce(
        (suma: number, l: { quantity?: number }) => suma + (l.quantity ?? 0),
        0,
      );
    } catch {
      return 0;
    }
  });
}

When('abre el carrito', async ({ page }) => {
  await page
    .getByRole('button', { name: /carrito/i })
    .first()
    .click();
  await expect(page.getByText('Mi carrito')).toBeVisible();
});

When('recarga la página', async ({ page }) => {
  await page.reload();
});

When('vacía el carrito', async ({ page }) => {
  await page.getByRole('button', { name: /vaciar carrito/i }).click();
  // Puede pedir confirmacion; si aparece, se confirma.
  const confirmar = page
    .getByRole('button', { name: /^(vaciar|confirmar|sí)/i })
    .last();
  if (await confirmar.count()) await confirmar.click();
});

When('pulsa proceder al pago', async ({ page }) => {
  await page.getByRole('button', { name: /proceder al pago/i }).click();
});

Then('se le confirma que el producto se añadió', async () => {
  expect(
    estado.avisoDeAñadido,
    'no apareció el aviso de producto añadido',
  ).toBe(true);
});

Then(
  'el carrito contiene {int} artículo(s)',
  async ({ page }, cantidad: number) => {
    await page
      .getByRole('button', { name: /carrito/i })
      .first()
      .click();
    await expect(
      page.getByText(new RegExp(`${cantidad}\\s+art[íi]culo`, 'i')).first(),
    ).toBeVisible();
  },
);

Then(
  'el carrito muestra el producto {string}',
  async ({ page }, nombre: string) => {
    const producto = estado.productos.get(nombre);
    await expect(page.getByText(producto!.nombreReal).first()).toBeVisible();
  },
);

Then(
  'el carrito muestra un total de {string}',
  async ({ page }, total: string) => {
    await expect(page.getByText(total).first()).toBeVisible();
  },
);

Then('el carrito queda vacío', async ({ page }) => {
  await expect(
    page
      .getByText(/carrito est[áa] vac[íi]o|no hay productos|agrega productos/i)
      .first(),
  ).toBeVisible();
});

// ------------------------------------------------- Categorias y contenido

When(
  'el cliente abre el catálogo filtrando por la categoría de {string}',
  async ({ page }, nombre: string) => {
    const producto = estado.productos.get(nombre);
    await page.goto(`/catalog?categorySlug=${producto!.categoriaSlug}`);
  },
);

Then(
  've el departamento del producto {string}',
  async ({ page }, nombre: string) => {
    const producto = estado.productos.get(nombre);
    await expect(
      page.getByText(producto!.departamentoNombre).first(),
    ).toBeVisible();
  },
);

Then(
  've la categoría del producto {string}',
  async ({ page }, nombre: string) => {
    const producto = estado.productos.get(nombre);
    await expect(
      page.getByText(producto!.categoriaNombre).first(),
    ).toBeVisible();
  },
);

Then('ve el correo de contacto', async ({ page }) => {
  await expect(page.getByText(/@/).first()).toBeVisible();
});

Then('ve el teléfono de contacto', async ({ page }) => {
  await expect(page.getByText(/\+53/).first()).toBeVisible();
});

Given(
  'que existe una página publicada llamada {string}',
  async ({}, titulo: string) => {
    estado.paginaCms = sembrarPagina(titulo, true);
    await invalidarCatalogo();
  },
);

Given(
  'que existe una página desactivada llamada {string}',
  async ({}, titulo: string) => {
    estado.paginaCms = sembrarPagina(titulo, false);
    await invalidarCatalogo();
  },
);

function sembrarPagina(titulo: string, activa: boolean) {
  const slug = `pagina-e2e-${estado.sufijo}`;
  const contenido = `Contenido de prueba ${estado.sufijo}`;
  sql(`
    INSERT INTO cms_pages (slug, title, content, is_active)
    VALUES ('${slug}', '${titulo}', '${contenido}', ${activa})`);
  return { slug, titulo, contenido };
}

When('el cliente abre esa página', async ({ page }) => {
  const res = await page.goto(`/paginas/${estado.paginaCms!.slug}`);
  estado.ultimoEstadoHttp = res?.status();
});

Then('ve su contenido', async ({ page }) => {
  await expect(
    page.getByText(estado.paginaCms!.contenido).first(),
  ).toBeVisible();
});

Then('no ve su contenido', async ({ page }) => {
  await expect(page.getByText(estado.paginaCms!.contenido)).toHaveCount(0);
});
