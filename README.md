# Maxi Habana — Tienda

La web pública de Maxi Habana: catálogo, carrito, pago y cuenta del cliente. Es la única pieza
que ve el comprador.

Next.js 16 (App Router, Turbopack) · React 19 · Clerk · zustand · TanStack Query · Tailwind ·
Base UI · bun.

## Puesta en marcha

**1. La API tiene que estar levantada primero.** La tienda no sirve nada sin ella: el catálogo,
el carrito y las direcciones vienen de `maxi_api_nestjs`, que además necesita su Postgres.

```bash
cd ../maxi_api_nestjs
pnpm run docker:db:start     # Postgres y MinIO
pnpm run start               # queda en el puerto que fije PORT (hoy 4000)
```

**2. Configurar la tienda.**

```bash
cp .env.example .env.local   # y rellenar los valores
bun install
bun run dev --port 3001
```

Lee `.env.example`: explica qué es cada variable y cuáles tienen que coincidir con las de la API.

> **Si algo se comporta de forma inexplicable en local, empieza por las claves de Clerk.**
> Sin `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` la tienda arranca igual, pero Clerk entra en *keyless
> mode* y se inventa una aplicación temporal: la sesión deja de valer contra la API y el
> formulario de acceso no responde. No avisa de nada.

**3. Sin almacenes no hay tienda.** El catálogo y los selectores de zona salen de la cobertura de
los almacenes. Con la base recién creada no hay ninguno, así que el catálogo sale vacío y no se
puede elegir provincia:

```bash
cd ../maxi_api_nestjs && pnpm run seed:stock-locations
```

## Comandos

| Comando | Para qué |
|---|---|
| `bun run dev` | Desarrollo con Turbopack |
| `bun run build` | Compilación de producción |
| `bun run start` | Servir la compilación |
| `bun run test` | Pruebas (vitest) |
| `bun run lint` | Linter (biome) |
| `bun run format` | Formatear |

## Cómo está organizado

```
src/
  app/           Rutas (App Router) y componentes compartidos de interfaz
  feature/       Una carpeta por dominio: address, cart, order, product, auth…
  shared/        Lo que cruza dominios: location, cms, taxonomy
  api/           Capa HTTP: `api()` para lo público, `apiAuth()` para lo del cliente
  hooks/         Hooks generales
  lib/           Utilidades sin dominio
  assets/        Imágenes y recursos
  proxy.ts       Middleware de Clerk
```

Dentro de cada `feature/` se repite la misma forma: `action/` (server actions), `service/`
(llamadas a la API), `adapter/` (respuesta cruda → dominio), `schema/` (zod), `type/`,
`components/`, `hook/`.

## Dos cosas que conviene saber antes de tocar

**Cache Components está activado** (`next.config.ts`). Todo lo que lea datos sin cachear —la
sesión, las cookies, los datos del cliente— tiene que vivir dentro de un `<Suspense>`, o Next
aborta el renderizado de la ruta entera. El patrón está en `app/pedidos/page.tsx` y en
`app/direcciones/page.tsx`: `auth()` se llama dentro del componente que envuelve el boundary,
nunca en un layout.

**Los componentes de interfaz son Base UI**, no Radix. Para componer se usa la prop `render`, no
`asChild`:

```tsx
<DialogTrigger render={<Button>Abrir</Button>} />
```

## Contrato con la API

La API documenta lo que expone a la tienda en `maxi_api_nestjs/docs/`:
`storefront-cart-integration.md`, `storefront-orders-integration.md` y
`storefront-addresses-integration.md`. **Describen también los errores**, que es lo que se olvida.
