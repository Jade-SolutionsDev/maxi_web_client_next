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
        <div className='flex items-center gap-6 py-3'>
          <div className='flex shrink-0 items-center gap-4'>
            <Image
              src={logo}
              alt='Logo'
              height={40}
              objectFit='contain'
              loading='eager'
            />
            <LocationBadge
              location='Plaza'
              className='bg-transparent rounded-none px-0 py-0'
            />
          </div>

          <SearchBar className='mx-auto w-full max-w-2xl' />

          <div className='flex shrink-0 items-center gap-6'>
            <UserMenu />
            <ShoppingCart className='icon' />
          </div>
        </div>
      </div>
    </header>
  );
};
