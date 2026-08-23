import { Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import { LocationBoundary } from '@/app/components/layout/location';
import { PrimaryNavBoundary } from '@/app/components/layout/PrimaryNavBoundary';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { SearchBoundary } from '@/app/components/search/SearchBoundary';
import logo from '@/assets/logo.svg';
import { Cart } from '@/feature/cart/components/Cart';
import { toTelHref } from '@/helpers';
import { getSiteSettings } from '@/shared/cms/service/cms.service';

/** Own row at full width on mobile, centered from md up. */
const searchBarClass =
  'order-last w-full min-w-0 md:order-0 md:mx-auto md:max-w-2xl md:flex-1';

/** El badge se integra al header: sin fondo ni padding propios. */
const locationBadgeHeaderClass =
  'min-w-0 rounded-none bg-transparent px-0 py-0';

export const Header = async () => {
  const { contact } = await getSiteSettings();

  return (
    <header className='sticky top-0 z-20 bg-primary shadow-sm'>
      <Container>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:gap-x-6'>
          {/* Izquierda: logo + ubicación */}
          <div className='flex min-w-0 items-center gap-2 md:gap-4'>
            <Link href='/' className='shrink-0'>
              <Image
                src={logo}
                alt='Maxi Habana'
                loading='eager'
                className='h-8 w-auto md:h-10'
              />
            </Link>
            <LocationBoundary className={locationBadgeHeaderClass} />
          </div>

          <SearchBoundary className={searchBarClass} />

          {/* Derecha: usuario + carrito */}
          <div className='ml-auto flex shrink-0 items-center gap-4 md:ml-0'>
            <UserMenu />

            <div className='hidden md:block'>
              <Cart />
            </div>
          </div>
        </div>
      </Container>

      {/* Barra de navegación: sólo md+; en mobile vive dentro del MobileNav */}
      <div className='hidden bg-secondary md:block'>
        <Container>
          <div className='flex h-10 items-center justify-between gap-6'>
            <PrimaryNavBoundary />

            <a
              href={toTelHref(contact.phone)}
              className='flex shrink-0 items-center gap-2 rounded-sm text-sm font-bold text-white/90 whitespace-nowrap underline transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'
            >
              <Phone className='h-4 w-4 shrink-0' aria-hidden='true' />
              {contact.phone}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
};
