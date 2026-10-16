import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { esFichaImposible } from '@/shared/routing/ficha-imposible';

/**
 * La mitad gratis de `MxH-0087`.
 *
 * Una ficha inexistente responde `200` en vez de `404`: las rutas son *Partial
 * Prerender* —`cacheComponents: true`—, así que el armazón sale antes de que
 * corra el código de la página y el `notFound()` de `ProductDetails` llega
 * cuando la cabecera ya se envió (`P-027` en el grafo). Arreglarlo del todo
 * cuesta **una llamada a la API por petición**, y eso es una decisión de Jade.
 *
 * Esta mitad no cuesta nada: una dirección de ficha que no acabe en un
 * identificador no puede existir, y se sabe aquí mismo sin llamar a nadie. Lo
 * que sigue respondiendo `200` es la otra mitad: una dirección **bien formada**
 * cuyo producto ya no está.
 *
 * `/paginas/<slug>` queda fuera a propósito: sus direcciones no llevan
 * identificador, así que no hay nada que comprobar gratis.
 */
export const proxy = clerkMiddleware((_auth, req) => {
  if (esFichaImposible(req.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL('/no-existe-esta-ficha', req.url), {
      status: 404,
    });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
