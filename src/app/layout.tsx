import type { Metadata } from 'next';
import { Fredoka, Geist } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from './components/feedback/Toaster';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MaxiHabana',
    template: '%s | MaxiHabana',
  },
  description:
    'Comprá online en MaxiHabana: departamentos, productos destacados y las mejores ofertas del día con entrega a domicilio.',
  applicationName: 'MaxiHabana',
  keywords: ['tienda online', 'ofertas', 'productos', 'compras', 'MaxiHabana'],
  openGraph: {
    type: 'website',
    siteName: 'MaxiHabana',
    title: 'MaxiHabana — Tu supermercado online',
    description:
      'Comprá online en MaxiHabana: departamentos, productos destacados y las mejores ofertas del día con entrega a domicilio.',
    url: siteUrl,
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maxi — Tu tienda online',
    description:
      'Comprá online en Maxi: departamentos, productos destacados y las mejores ofertas del día.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className='min-h-full flex flex-col'>
        <ClerkProvider
          allowedRedirectOrigins={['http://localhost:3000', siteUrl]}
        >
          <Header />
          <main className='grow'>
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
          <Footer />
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
