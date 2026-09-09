# Pruebas de extremo a extremo de la tienda

**Escritas en Gherkin, en español.** Las de `features/` se leen sin saber Playwright ni
programar: describen qué debe hacer la tienda y por qué. Los pasos que las ejecutan viven en
`steps/`.

```
e2e/
  features/     Lo que la tienda debe hacer, en lenguaje corriente
  steps/        Cómo se comprueba cada frase de las features
  helpers.ts    Utilidades: SQL, invalidar caché, zona con cobertura
  .generado/    Specs que produce bddgen. No se edita ni se versiona
```

Playwright sobre el **Chrome del sistema** (`channel: 'chrome'`): no descarga navegadores.

## Antes de ejecutar

La API con su base, y la tienda:

```bash
cd ../maxi_api_nestjs && pnpm run docker:db:start && pnpm run start   # :4000
bun run dev --port 3001                                              # :3001
```

**Y la base sembrada entera**, en este orden:

```bash
cd ../maxi_api_nestjs
pnpm run seed:stock-locations   # almacenes y su cobertura
pnpm run seed:fulfillment       # opciones de entrega y puntos de recogida
pnpm run seed:products          # catálogo
pnpm run seed:inventory         # existencias
pnpm run seed:client            # el cliente de QA
```

**No basta con `seed:stock-locations`.** Sin `seed:fulfillment` no hay ninguna
opción de entrega ni ningún punto de recogida, así que la tienda no puede
ofrecer nada: el checkout enseña el mensaje de soporte en vez del formulario y
**todos** los escenarios `@sesion` de `compra.feature` fallan sin decir por qué.
Costó una tarde averiguarlo.

## Ejecutar

```bash
bun run test:e2e           # sin ventana
bun run test:e2e:headed    # viendo el navegador
```

Ambos ejecutan `bddgen` antes: traduce las features a specs. **Sin ese paso Playwright no
encuentra nada.**

Al fallar guarda **captura, vídeo y traza** en `test-results/`. La traza se recorre paso a paso
con `npx playwright show-trace <ruta>`.

## Añadir un caso de prueba

1. Escribe el escenario en la feature que le corresponda, en español corriente.
2. Ejecuta. Si algún paso es nuevo, `bddgen` avisa de que falta.
3. Impleméntalo en `steps/pasos.ts` y vuelve a ejecutar.

Los escenarios **siembran sus propios datos** con un sufijo de tiempo y los borran al terminar,
así que no chocan entre ellos ni con lo que haya en la base.

## Cuatro cosas que conviene saber

**`vitest.config.mts` excluye esta carpeta.** Sin eso, vitest recoge los `.spec.js` generados y
falla al importar Playwright.

**`fullyParallel: false` y `workers: 1`** a propósito: los escenarios comparten base de datos.

**Las imágenes deben ser de un dominio autorizado** en `next.config.ts` (`placehold.co` sirve).
Una URL de otro dominio **tumba la página entera del catálogo** — ver `MxH-0086`.

**La cookie de zona (`maxi_location`) debe compartir dominio con la navegación.** Todo usa
`localhost`, no `127.0.0.1`: para el navegador son sitios distintos y la cookie no viajaría.
