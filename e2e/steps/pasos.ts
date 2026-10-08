import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import {
  abrir,
  conRecargaSiHaceFalta,
  almacenDeLasPruebas,
  lineasGuardadasDe,
  API,
  invalidarCatalogo,
  municipioConCobertura,
  nuevoSufijo,
  olvidarProductos,
  productoSembrado,
  quizaSembrado,
  registrarProducto,
  sembrarProducto,
  sql,
} from "../helpers";
import { CORREO } from "../setup/acceso";

const { Given, When, Then, Before, After } = createBdd();

/** El cliente con el que se inicia sesion en las pruebas con sesion. */
const CORREO_CLIENTE = "qa.direcciones@maxihabana.com";

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
  olvidarProductos();
  estado = { sufijo: nuevoSufijo(), productos: new Map() };
});

After(async () => {
  // Cada escenario se lleva lo que sembro.
  sql(
    `DELETE FROM inventory WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%')`,
  );
  sql(`DELETE FROM products WHERE sku LIKE 'E2E-${estado.sufijo}%'`);
  sql(`DELETE FROM categories WHERE slug LIKE '%-e2e-${estado.sufijo}%'`);
  // En orden de dependencia: las versiones cuelgan de la pagina por clave
  // ajena, y hay que soltar primero la que la pagina senala como publicada.
  sql(`
    UPDATE cms_pages SET published_version_id = NULL
     WHERE slug = 'pagina-e2e-${estado.sufijo}';
    DELETE FROM cms_page_versions
     WHERE page_id IN (SELECT id FROM cms_pages WHERE slug = 'pagina-e2e-${estado.sufijo}');
    DELETE FROM cms_pages WHERE slug = 'pagina-e2e-${estado.sufijo}'`);

  /**
   * Y se invalida el cache: la tienda guarda el catalogo un dia entero, asi que
   * borrar de la base no basta. Sin esto, escenarios posteriores ven productos
   * que ya no existen.
   */
  await invalidarCatalogo();
});

// ---------------------------------------------------------------- Antecedentes

Given("que el cliente ha elegido una zona con entrega", async ({ context }) => {
  await context.addCookies([
    {
      name: "maxi_location",
      value: municipioConCobertura(),
      // Del entorno, no fijo: contra un dominio real 'localhost' no aplica y
      // reaparece el modal de ubicacion, que tapa media pagina.
      domain: new URL(process.env.E2E_BASE_URL ?? "http://localhost:3001")
        .hostname,
      path: "/",
    },
  ]);
});

Given("que el cliente no ha elegido zona", async ({ context }) => {
  await context.clearCookies();
});

Given(
  "que existe un producto {string} con {int} unidades y un {int}% de rebaja",
  async ({}, nombre: string, unidades: number, rebaja: number) => {
    const sembrado = sembrarProducto(nombre, rebaja);
    const almacen = almacenDeLasPruebas();
    sql(
      `INSERT INTO inventory (location_id, product_id, quantity) VALUES ('${almacen}', '${sembrado.id}', ${unidades})`,
    );
    registrarProducto(nombre, sembrado);
    await invalidarCatalogo();
  },
);

Given(
  "que existe un producto {string} sin existencias",
  async ({}, nombre: string) => {
    registrarProducto(nombre, sembrarProducto(nombre, 0));
    await invalidarCatalogo();
  },
);

/**
 * MxH-0086. La imagen se cambia después de sembrar el producto, que es como
 * ocurre de verdad: alguien pega a mano una URL de un sitio que la tienda no
 * tiene autorizado. Antes bastaba con esto para dejar el catálogo entero en
 * «Algo salió mal».
 */
Given(
  "que el producto {string} tiene una imagen de un dominio no autorizado",
  async ({}, nombre: string) => {
    const producto = productoSembrado(nombre);
    expect(producto, `el producto "${nombre}" no está sembrado`).toBeTruthy();
    sql(
      `UPDATE products SET image_url = 'https://x/p.png' WHERE slug = '${producto!.slug}'`,
    );
    await invalidarCatalogo();
  },
);

// ------------------------------------------------------------------- Acciones

When("el cliente abre el catálogo", async ({ page }) => {
  await abrir(page, "/catalog");
});

When("el cliente abre {string}", async ({ page }, ruta: string) => {
  const res = await page.goto(ruta);
  estado.ultimoEstadoHttp = res?.status();
});

When("pulsa sobre el producto {string}", async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);

  /**
   * El enlace de la tarjeta, no el texto suelto. El nombre del producto sale
   * **dos veces** en cada tarjeta —el `alt` de la imagen y el título—, y
   * `getByText(...).first()` se quedaba con el nodo que no se ve:
   *
   *     locator resolved to <h3 class="line-clamp-3 ...">Cola E2E 90362158</h3>
   *     element is not visible
   *
   * Se buscó la caché fría durante un rato por este fallo, y la tarjeta estaba
   * en la página todo el tiempo: la captura del fallo la enseña.
   */
  const enLaPagina = () =>
    page.getByRole("link", { name: producto!.nombreReal }).first();

  // La pagina puede haber llegado de la cache vieja, y entonces no hay nada
  // que pulsar hasta pedirla otra vez.
  await conRecargaSiHaceFalta(page, () =>
    expect(enLaPagina()).toBeVisible({ timeout: 10_000 }),
  );
  await enLaPagina().click();
});

When(
  "el cliente busca {string} en el catálogo",
  async ({ page }, termino: string) => {
    // El termino puede no ser un producto: hay un escenario que busca algo
    // que no existe justo para ver que la pagina lo dice.
    const texto = quizaSembrado(termino)?.nombreReal ?? termino;
    await abrir(page, `/catalog?q=${encodeURIComponent(texto)}`);
  },
);

When("se consultan los productos públicos de la API", async ({ request }) => {
  const res = await request.get(`${API}/api/public/products`);
  expect(res.status()).toBe(200);
  estado.respuestaApi = (await res.json()).data;
});

// ---------------------------------------------------------- Comprobaciones

Then("ve el producto {string}", async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);
  await conRecargaSiHaceFalta(page, () =>
    expect(page.getByText(producto!.nombreReal).first()).toBeVisible({
      timeout: 10_000,
    }),
  );
});

Then("no ve el producto {string}", async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);
  await conRecargaSiHaceFalta(page, () =>
    expect(page.getByText(producto!.nombreReal)).toHaveCount(0, {
      timeout: 10_000,
    }),
  );
});

Then("ve el precio {string}", async ({ page }, precio: string) => {
  await expect(page.getByText(precio, { exact: false }).first()).toBeVisible();
});

Then("la página sigue funcionando", async ({ page }) => {
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByText("Algo salió mal")).toHaveCount(0);
});

Then("la respuesta incluye {string}", async ({}, nombre: string) => {
  const producto = productoSembrado(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).toContain(producto!.nombreReal);
});

Then("la respuesta no incluye {string}", async ({}, nombre: string) => {
  const producto = productoSembrado(nombre);
  const nombres = estado.respuestaApi!.items.map((p) => p.name);
  expect(nombres).not.toContain(producto!.nombreReal);
});

Then(
  "{string} tiene precio base {int}, rebaja {int} y precio final {int}",
  async ({}, nombre: string, base: number, rebaja: number, final: number) => {
    const producto = productoSembrado(nombre);
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
  "la página muestra el título {string}",
  async ({ page }, titulo: string) => {
    await expect(
      page.getByRole("heading", { name: titulo, level: 1 }),
    ).toBeVisible();
  },
);

Then("acaba en la pantalla de acceso", async ({ page }) => {
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("heading", { name: "Iniciar sesión" }),
  ).toBeVisible();
});

Then("la respuesta es un 404", async ({ page }) => {
  expect(estado.ultimoEstadoHttp).toBe(404);
  /**
   * Lo que se comprueba es que al cliente **se le diga**, no que en algun
   * sitio ponga «404»: ese numero vive ahora dentro de la ilustracion, que es
   * un SVG y no aporta texto. La pagina sigue siendo correcta —devuelve 404 y
   * lo explica— y antes esto la daba por rota.
   */
  await expect(
    page.getByText(/la p[aá]gina a la que intentas acceder no existe/i).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /volver al inicio/i }).first(),
  ).toBeVisible();
});

Then(
  "la portada muestra las secciones de destacados, ofertas y recientes",
  async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Productos destacados" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "En oferta" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nuestros productos más recientes" }),
    ).toBeVisible();
  },
);

Then("se le pide que elija su zona", async ({ page }) => {
  await expect(page.getByText("¿Dónde estás?")).toBeVisible();
});

Then("no se le pide que elija su zona", async ({ page }) => {
  await expect(page.getByText("¿Dónde estás?")).toHaveCount(0);
});

Then("la cabecera muestra su zona", async ({ page }) => {
  // Dos veces, no una: la cabecera lleva el rótulo suelto y otra copia dentro
  // del botón de ubicación, y el locator a secas da «strict mode violation».
  // Que esté una vez es lo que el escenario comprueba.
  await expect(page.getByText("Disponible en:").first()).toBeVisible();
});

// ---------------------------------------------------------------- El carrito

When("añade el primer producto al carrito", async ({ page }) => {
  // Cuantas unidades hay antes, para esperar a que suban de verdad.
  const antes = await unidadesEnCarrito(page);
  const lineasAntes = await lineasEnCabecera(page);
  /**
   * Con sesion el carrito vive en el servidor; sin ella, en `localStorage`.
   * La cookie de Clerk es la que lo distingue, y hace falta saberlo antes de
   * decidir a quien se le pregunta si el producto entro.
   */
  const conSesion = (await page.context().cookies()).some(
    (galleta) => galleta.name === "__session",
  );
  const guardadasAntes = conSesion ? lineasGuardadasDe(CORREO) : 0;

  /**
   * El carrito hidrata despues de pintar la pagina, y el anunciador toma el
   * primer estado que ve como "el de partida": si se pulsa antes de eso, el
   * aviso de producto añadido no llega a emitirse (MxH-0089). La senal de que
   * ya hidrato es su propio almacen: zustand lo escribe al rehidratarse.
   *
   * Va **antes** de tocar el boton: el catalogo se vuelve a pintar al hidratar
   * y al revalidarse, asi que un elemento agarrado antes se queda huerfano.
   * «Element is not attached to the DOM» al desplazarse hasta el, cada noche.
   */
  await page
    .waitForFunction(
      () => localStorage.getItem("cart-storage") !== null,
      null,
      {
        timeout: 10_000,
      },
    )
    .catch(() => {
      // Con sesion el carrito vive en el servidor y esa clave no aparece.
    });

  /**
   * Un localizador, no un elemento: Playwright lo resuelve de nuevo en cada
   * intento, asi que sobrevive a que el catalogo se repinte. Y `click()` ya
   * espera a que sea visible y se desplaza solo, de modo que el
   * `scrollIntoViewIfNeeded` + `hover` que habia aqui solo anadia dos sitios
   * mas donde el elemento podia desaparecer entre medias.
   *
   * El `hover` ademas hacia dano: el boton no depende de el —en
   * `ProductCard.tsx` no hay `opacity-0` ni `invisible`, del `group-hover`
   * solo cuelga la escala de la imagen—, pero la tarjeta lleva
   * `hover:-translate-y-1` con 300 ms de transicion. Pasar el raton por
   * encima **la mueve**, y Playwright espera a que el elemento se quede
   * quieto: era una espera de regalo y una ventana mas para que la tarjeta se
   * reemplazara justo ahi.
   */
  const boton = page.getByRole("button", { name: /^a[ñn]adir/i }).first();
  await boton.click({ timeout: 20_000 });

  // El aviso se desvanece solo, asi que se anota aqui, en el instante en que
  // aparece. Comprobarlo mas tarde seria una carrera perdida.
  // `isVisible()` no espera: devuelve el estado de ese instante. Hay que
  // esperar de verdad a que el aviso aparezca.
  estado.avisoDeAñadido = await page
    .getByText(/producto añadido al carrito/i)
    .first()
    .waitFor({ state: "visible", timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  /**
   * No se espera al aviso: es un toast que se desvanece, y usarlo para
   * sincronizar hace que la prueba falle segun lo rapida que vaya la maquina.
   * Se espera al estado guardado, que es lo que de verdad importa.
   */
  /**
   * Dos senales, porque el carrito vive en dos sitios: en `localStorage` si no
   * hay sesion, y en el servidor si la hay. La cabecera cuenta lineas, asi que
   * anadir dos veces el mismo producto solo se nota en las unidades.
   */
  /**
   * El carrito vive en dos sitios y se pinta en un tercero: en `localStorage`
   * si no hay sesion, en el servidor si la hay, y en el contador de la
   * cabecera en ambos casos. Primero se espera a lo que se ve, que es lo que
   * le importa al cliente.
   */
  const seVe = await expect
    .poll(
      async () =>
        (await unidadesEnCarrito(page)) > antes ||
        (await lineasEnCabecera(page)) > lineasAntes,
      { timeout: 15_000 },
    )
    .toBe(true)
    .then(() => true)
    .catch(() => false);

  /**
   * Y si no se ve, se pregunta por el dato antes de dar el paso por fallido.
   * Con sesion el contador de la cabecera se queda en cero mientras el
   * carrito no este «asentado», asi que una respuesta lenta lo dejaba a cero
   * sin que nada estuviera roto: el paso culpaba a la tienda de no anadir un
   * producto que si estaba anadido. Se consulta **una vez**, al final, y no
   * dentro del sondeo: cada consulta abre un `psql` y meterla en el bucle
   * ralentizaba justo lo que se esta midiendo.
   *
   * **Esta consulta no es la comprobacion, es el desempate**, y este paso es
   * preparacion: lo que mide es que el producto entro, no que la tienda lo
   * pinte. Que el cliente lo vea lo comprueba «el carrito contiene N
   * articulos», que abre el carrito y lee lo que hay escrito, y que se usa en
   * nueve escenarios con sesion y sin ella. Si la tienda dejara de refrescar
   * el carrito, esos se pondrian rojos; el desempate de aqui no lo puede
   * tapar. Si algun dia este paso deja de tener esa red detras, hay que
   * quitarlo.
   */
  if (!seVe) {
    expect(conSesion, "el carrito de invitado no llego a cambiar").toBe(true);
    expect(lineasGuardadasDe(CORREO)).toBeGreaterThan(guardadasAntes);
  }
});

/** Lineas que declara la cabecera, con sesion o sin ella. */
async function lineasEnCabecera(page: import("@playwright/test").Page) {
  const etiqueta = await page
    .getByRole("button", { name: /carrito de compra/i })
    .first()
    .getAttribute("aria-label");
  return Number(etiqueta?.match(/(\d+)/)?.[1] ?? 0);
}

/** Unidades guardadas hoy en el carrito de invitado (localStorage). */
async function unidadesEnCarrito(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    try {
      const crudo = localStorage.getItem("cart-storage");
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

When("abre el carrito", async ({ page }) => {
  await page
    .getByRole("button", { name: /carrito/i })
    .first()
    .click();
  await expect(page.getByText("Mi carrito")).toBeVisible();
});

When("recarga la página", async ({ page }) => {
  await page.reload();
});

When("vacía el carrito", async ({ page }) => {
  await page.getByRole("button", { name: /vaciar carrito/i }).click();
  // Puede pedir confirmacion; si aparece, se confirma.
  const confirmar = page
    .getByRole("button", { name: /^(vaciar|confirmar|sí)/i })
    .last();
  if (await confirmar.count()) await confirmar.click();
});

When("pulsa proceder al pago", async ({ page }) => {
  await esperarCarritoEnServidor();
  await page.getByRole("button", { name: /proceder al pago/i }).click();
});

/**
 * El carrito de quien tiene cuenta se guarda en el servidor, y el checkout lo
 * lee de ahi. Sin sesion no hay nada que esperar, asi que esto no falla: se
 * rinde en silencio y deja que el escenario siga.
 */
async function esperarCarritoEnServidor() {
  const desde = Date.now();
  while (Date.now() - desde < 8_000) {
    const filas = Number(
      sql(
        `SELECT count(*) FROM cart_items WHERE client_id IN (SELECT id FROM clients WHERE email = '${CORREO_CLIENTE}')`,
      ),
    );
    if (filas > 0) {
      return;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

Then("se le confirma que el producto se añadió", async () => {
  expect(
    estado.avisoDeAñadido,
    "no apareció el aviso de producto añadido",
  ).toBe(true);
});

Then(
  "el carrito contiene {int} artículo(s)",
  async ({ page }, cantidad: number) => {
    await page
      .getByRole("button", { name: /carrito/i })
      .first()
      .click();
    await expect(
      page.getByText(new RegExp(`${cantidad}\\s+art[íi]culo`, "i")).first(),
    ).toBeVisible();
  },
);

Then(
  "el carrito muestra el producto {string}",
  async ({ page }, nombre: string) => {
    const producto = productoSembrado(nombre);
    await expect(page.getByText(producto!.nombreReal).first()).toBeVisible();
  },
);

Then(
  "el carrito muestra un total de {string}",
  async ({ page }, total: string) => {
    await expect(page.getByText(total).first()).toBeVisible();
  },
);

Then("el carrito queda vacío", async ({ page }) => {
  await expect(
    page
      .getByText(/carrito est[áa] vac[íi]o|no hay productos|agrega productos/i)
      .first(),
  ).toBeVisible();
});

/**
 * MxH-0099: al cancelar un pedido pendiente, sus líneas vuelven al carrito.
 *
 * Se cuentan las líneas **dentro del carrito abierto**, por su botón de
 * eliminar, que solo existe una vez por línea. Antes se leía el contador de la
 * cabecera, y eso no podía funcionar aquí: el escenario acaba de abrir el
 * carrito, el panel es modal y deja la cabecera entera en `aria-hidden`, así
 * que el botón del contador no se encuentra y la cuenta sale 0 aunque el
 * carrito tenga sus productos de vuelta. El fallo era de la medida, no de la
 * tienda: en la captura del fallo el producto estaba listado.
 */
Then("el carrito recupera sus productos", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: /eliminar .* del carrito/i }).first(),
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    page
      .getByText(/carrito est[áa] vac[íi]o|no hay productos|agrega productos/i)
      .first(),
  ).toBeHidden();
});

// ------------------------------------------------- Categorias y contenido

When(
  "el cliente abre el catálogo filtrando por la categoría de {string}",
  async ({ page }, nombre: string) => {
    const producto = productoSembrado(nombre);
    await abrir(page, `/catalog?categorySlug=${producto!.categoriaSlug}`);
  },
);

Then(
  "ve el departamento del producto {string}",
  async ({ page }, nombre: string) => {
    const producto = productoSembrado(nombre);
    await expect(
      page.getByText(producto!.departamentoNombre).first(),
    ).toBeVisible();
  },
);

Then(
  "ve la categoría del producto {string}",
  async ({ page }, nombre: string) => {
    const producto = productoSembrado(nombre);
    await expect(
      page.getByText(producto!.categoriaNombre).first(),
    ).toBeVisible();
  },
);

Then("ve el correo de contacto", async ({ page }) => {
  await expect(page.getByText(/@/).first()).toBeVisible();
});

Then("ve el teléfono de contacto", async ({ page }) => {
  await expect(page.getByText(/\+53/).first()).toBeVisible();
});

Given(
  "que existe una página publicada llamada {string}",
  async ({}, titulo: string) => {
    estado.paginaCms = sembrarPagina(titulo, true);
    await invalidarCatalogo();
  },
);

Given(
  "que existe una página desactivada llamada {string}",
  async ({}, titulo: string) => {
    estado.paginaCms = sembrarPagina(titulo, false);
    await invalidarCatalogo();
  },
);

/**
 * Una pagina del CMS, sembrada con el modelo de versiones.
 *
 * Desde la migracion `AddCmsPageVersions`, `cms_pages.title`/`content` son el
 * BORRADOR: lo que la tienda muestra es la fila de `cms_page_versions` a la
 * que apunta `published_version_id`. Sembrando solo en `cms_pages` quedaba una
 * pagina en borrador, la tienda respondia 404 —correctamente— y la prueba lo
 * leia como que el contenido no se veia.
 *
 * `activa` publica: crea la version 1 y la deja apuntada. Sin publicar, la
 * pagina existe en borrador, que es justo lo que la tienda no debe mostrar.
 */
function sembrarPagina(titulo: string, activa: boolean) {
  const slug = `pagina-e2e-${estado.sufijo}`;
  const contenido = `Contenido de prueba ${estado.sufijo}`;
  const id = sql(`
    INSERT INTO cms_pages (slug, title, content, is_active)
    VALUES ('${slug}', '${titulo}', '${contenido}', ${activa})
    RETURNING id`);

  if (activa) {
    const version = sql(`
      INSERT INTO cms_page_versions
        (page_id, version, title, content, published_by_name)
      VALUES ('${id}', 1, '${titulo}', '${contenido}', 'Pruebas e2e')
      RETURNING id`);
    sql(`
      UPDATE cms_pages SET published_version_id = '${version}'
       WHERE id = '${id}'`);
  }

  return { slug, titulo, contenido };
}

When("el cliente abre esa página", async ({ page }) => {
  const res = await page.goto(`/paginas/${estado.paginaCms!.slug}`);
  estado.ultimoEstadoHttp = res?.status();
});

Then("ve su contenido", async ({ page }) => {
  await expect(
    page.getByText(estado.paginaCms!.contenido).first(),
  ).toBeVisible();
});

Then("no ve su contenido", async ({ page }) => {
  await expect(page.getByText(estado.paginaCms!.contenido)).toHaveCount(0);
});

When("agrega una unidad de {string}", async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);
  await page
    .getByRole("button", {
      name: `Agregar una unidad de ${producto.nombreReal}`,
    })
    .last()
    .click();
});

When("elimina {string} del carrito", async ({ page }, nombre: string) => {
  const producto = productoSembrado(nombre);
  await page
    .getByRole("button", {
      name: `Eliminar ${producto.nombreReal} del carrito`,
    })
    .click();
});
