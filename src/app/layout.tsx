import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
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
  keywords: [
    'supermercado online',
    'ofertas',
    'productos',
    'compras',
    'MaxiHabana',
  ],
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
    title: 'Maxi — Tu supermercado online',
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

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <ClerkProvider>
          <Header />
          <main className='grow'>{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
