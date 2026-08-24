import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/app/components/ui/page-hero';
import { AddressList } from '@/feature/address/components/AddressList';
import { AddressListSkeleton } from '@/feature/address/components/AddressListSkeleton';

export const metadata: Metadata = {
  title: 'Mis direcciones | Maxi Habana',
  robots: { index: false },
};

export default function AddressesPage() {
  return (
    <main>
      <PageHero
        title='Mis direcciones'
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Mis direcciones' },
        ]}
      />

      {/* Cache Components: everything that reads the session or the customer's
          own data lives inside the boundary, so the shell is not held back. */}
      <Suspense fallback={<AddressListSkeleton />}>
        <AddressList />
      </Suspense>
    </main>
  );
}
