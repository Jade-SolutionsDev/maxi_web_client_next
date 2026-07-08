import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import { LocationBadge } from '@/app/components/layout/LocationBadge';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { SearchBar } from '@/app/components/search/SearchBar';
import logo from '@/assets/logo.svg';

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
    </header>
  );
};
