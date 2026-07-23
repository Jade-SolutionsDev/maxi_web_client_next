import { Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '@/app/components/layout/Container';
import { LocationBadge } from '@/app/components/layout/LocationBadge';
import { MobileNav } from '@/app/components/layout/mobile-nav';
import { NavItemsFallback } from '@/app/components/layout/NavItemsFallback';
import { PrimaryNav } from '@/app/components/layout/PrimaryNav';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { SearchBar } from '@/app/components/search/SearchBar';
import logo from '@/assets/logo.svg';
import { Cart } from '@/feature/cart/components/Cart';
import { contactPhone } from './constants/nav.constants';

export const Header = () => {
  return (
    <header className='sticky top-0 z-20 bg-primary shadow-sm'>
      <Container>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:gap-x-6'>
          {/* Izquierda: menú mobile + logo + ubicación */}
          <div className='flex shrink-0 items-center gap-2 md:gap-4'>
            <MobileNav />
            <Link href='/'>
              <Image
                src={logo}
                alt='Maxi Habana'
                loading='eager'
                className='h-8 w-auto md:h-10'
              />
            </Link>
            <LocationBadge
              location='Plaza'
              className='shrink-0 rounded-none bg-transparent px-0 py-0'
            />
          </div>

          {/* Buscador: fila propia a todo el ancho en mobile, centrado en md+ */}
          <SearchBar className='order-last w-full min-w-0 md:order-0 md:mx-auto md:max-w-2xl md:flex-1' />

          {/* Derecha: usuario + carrito */}
          <div className='ml-auto flex shrink-0 items-center gap-4 md:ml-0'>
            <div className='hidden md:block'>
              <UserMenu />
            </div>

            <Cart />
          </div>
        </div>
      </Container>

      {/* Barra de navegación: sólo md+; en mobile vive dentro del MobileNav */}
      <div className='hidden bg-secondary md:block'>
        <Container>
          <div className='flex h-10 items-center justify-between gap-6'>
            {/* usePathname (dentro de PrimaryNav) es dinámico por navegación:
                con cacheComponents va dentro de <Suspense>. El fallback pinta el
                mismo <nav> estático en el shell, sin el indicador deslizante. */}
            <Suspense fallback={<NavItemsFallback />}>
              <PrimaryNav />
            </Suspense>

            <a
              href={contactPhone.href}
              className='flex shrink-0 items-center gap-2 rounded-sm text-sm font-bold text-white/90 whitespace-nowrap underline transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
            >
              <Phone className='h-4 w-4 shrink-0' aria-hidden='true' />
              {contactPhone.label}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
};
