# Pruebas de extremo a extremo de la tienda

Playwright sobre el **Chrome del sistema** (`channel: 'chrome'`): no descarga navegadores propios.
Prueban lo que ni los unitarios ni los e2e de la API pueden probar — que **lo que la API sirve se
ve en la tienda**, en un navegador de verdad.

## Antes de ejecutar

Hace falta la API levantada con su base, y la tienda:

```bash
cd ../maxi_api_nestjs && pnpm run docker:db:start && pnpm run start   # :4000
bun run dev --port 3001                                              # :3001
```

**Y almacenes sembrados**, o el catálogo sale vacío y no hay zona que elegir:

```bash
cd ../maxi_api_nestjs && pnpm run seed:stock-locations
```

## Ejecutar

```bash
bun run test:e2e           # sin ventana
bun run test:e2e:headed    # viendo el navegador
```

Al fallar guarda **captura, vídeo y traza** en `test-results/`. La traza se recorre paso a paso con
`npx playwright show-trace <ruta>`.

## Cómo están escritas

- **Siembran por SQL**, no por la interfaz de administración: aquí se prueba que la tienda refleja
  el catálogo. Crear el catálogo desde el admin es otra prueba, y va en el repo del admin.
- **Se navega pulsando**, no construyendo URLs: la prueba no depende de cómo se forme cada enlace.
- Cada prueba limpia lo que siembra y usa un sufijo de tiempo, para no chocar con datos existentes.
- `fullyParallel: false`: comparten base de datos.
- `vitest.config.mts` excluye esta carpeta — si no, vitest intentaría ejecutar estos `.spec.ts`.

## Dos trampas que ya costaron tiempo

**Las imágenes deben ser de un dominio autorizado** en `next.config.ts` (`placehold.co` sirve). Una
URL de otro dominio **tumba la página entera del catálogo**, no solo esa tarjeta.

**La tienda exige zona antes de mostrar nada.** Se fija con la cookie `maxi_location`, y su dominio
tiene que coincidir con el de la navegación: todo usa `localhost`, no `127.0.0.1`.
