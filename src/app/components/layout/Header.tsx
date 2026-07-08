import { Phone, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import { LocationBadge } from '@/app/components/layout/LocationBadge';
import { NavItem } from '@/app/components/layout/NavItem';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { SearchBar } from '@/app/components/search/SearchBar';
import logo from '@/assets/logo.svg';
import { contactPhone, navItems } from './constants/nav.constants';

export const Header = () => {
  return (
    <header className='sticky top-0 z-20 bg-primary shadow-sm'>
      <Container>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:gap-x-6'>
          {/* Izquierda: logo + ubicación */}
          <div className='flex shrink-0 items-center gap-3 md:gap-4'>
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
            <UserMenu />
            <ShoppingCart className='icon' />
          </div>
        </div>
      </Container>
      {/* Barra de navegación */}
      <div className='bg-secondary'>
        <Container>
          <div className='flex h-10 items-center justify-between gap-6'>
            <nav
              aria-label='Navegación principal'
              className='flex items-center gap-6 overflow-x-auto'
            >
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>

            <a
              href={contactPhone.href}
              
              className='flex shrink-0 items-center gap-2 rounded-sm text-sm font-bold text-white/90 whitespace-nowrap transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange underline'
            >
              <Phone className='h-4 w-4 shrink-0 ' aria-hidden='true' />
              {contactPhone.label}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
};
