import type { Metadata } from 'next';
import { Fredoka, Geist } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { CartSync } from '@/feature/cart/components/CartSync';
import { SiteStructuredData } from '@/shared/seo/components/SiteStructuredData';
import { SITE_URL } from '@/shared/seo/site-url';
import { Toaster } from './components/feedback/Toaster';
import { BottomNav } from './components/layout/bottom-nav';
import { CookieBoundary } from './components/layout/cookies/CookieBoundary';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MaxiHabana',
    template: '%s | MaxiHabana',
  },
  description:
    'Compra online en MaxiHabana: departamentos, productos destacados y las mejores ofertas del día, con recogida en la tienda.',
  applicationName: 'MaxiHabana',
  keywords: ['tienda online', 'ofertas', 'productos', 'compras', 'MaxiHabana'],
  openGraph: {
    type: 'website',
    siteName: 'MaxiHabana',
    title: 'MaxiHabana — Tu supermercado online',
    description:
      'Compra online en MaxiHabana: departamentos, productos destacados y las mejores ofertas del día, con recogida en la tienda.',
    url: SITE_URL,
    locale: 'es_CU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maxi — Tu tienda online',
    description:
      'Compra online en Maxi: departamentos, productos destacados y las mejores ofertas del día.',
  },
  // Sin bloque `robots` a propósito: `index, follow` es lo que un buscador hace
  // por omisión, así que declararlo no ganaba nada y se emitía en **todas** las
  // páginas, también en las de «no encontrado», que sirven su propio `noindex`.
  // Las dos metas juntas obligaban a Google a desempatar por la más restrictiva.
  // Medido el 16-oct-2026: sin este bloque, una ficha inexistente emite solo
  // `noindex` y la portada no emite ninguna. Ver P-027 y MxH-0087.
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es'
      className={`${geistSans.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col pb-[var(--bottom-nav-height)]'>
        <ClerkProvider
          allowedRedirectOrigins={['http://localhost:3000', SITE_URL]}
        >
          {/*
            El adaptador envuelve todo, no solo <main>: el buscador de la
            cabecera lee los filtros del catalogo por nuqs, y fuera del
            adaptador el hook no funciona.
          */}
          <NuqsAdapter>
            <CartSync />
            <Header />
            <main className='grow'>{children}</main>
            <Footer />
            <BottomNav />
            {/*
              Al final del arbol y en posicion fija: informa sin empujar el
              contenido ni entrar en el orden de lectura antes de tiempo.
            */}
            <CookieBoundary />
          </NuqsAdapter>
        </ClerkProvider>
        <Toaster />
        <SiteStructuredData />
      </body>
    </html>
  );
}
