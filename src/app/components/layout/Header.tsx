import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { LocationBadge } from '@/app/components/layout/LocationBadge';
import { UserMenu } from '@/app/components/layout/UserMenu';
import { SearchBar } from '@/app/components/search/SearchBar';
import logo from '@/assets/logo.svg';

export const Header = () => {
  return (
    <header className='sticky top-0 z-20 bg-primary shadow-sm'>
      <div className='w-full px-4 sm:px-6 lg:px-12'>
        <div className='flex flex-wrap items-center gap-x-6 gap-y-3 py-3'>
          <div className='order-1 contents md:flex md:shrink-0 md:items-center md:gap-4'>
            <Image
              src={logo}
              alt='Logo'
              height={40}
              objectFit='contain'
              loading='eager'
              className='order-1'
            />
            <LocationBadge
              location='Plaza'
              className='order-3 shrink-0 bg-transparent rounded-none px-0 py-0'
            />
          </div>

          <SearchBar className='order-4 min-w-0 flex-1 md:order-2 md:mx-auto md:w-full md:max-w-2xl md:flex-initial' />

          <div className='order-2 ml-auto flex shrink-0 items-center gap-6 md:order-3 md:ml-0'>
            <UserMenu />
            <ShoppingCart className='icon' />
          </div>
        </div>
      </div>
    </header>
  );
};
