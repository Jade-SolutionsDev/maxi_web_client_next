import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Container } from '@/app/components/layout/Container';
import { getLocationCatalog } from '@/shared/location/service/location.service';
import { getAddresses } from '../service/address.service';
import { AddressCard } from './AddressCard';
import { AddressEmpty } from './AddressEmpty';
import { AddressFormDialog } from './AddressFormDialog';

/**
 * Reads the session and the customer's addresses. Same shape as OrdersContent:
 * the whole thing renders inside the page's Suspense boundary, which is what
 * Cache Components requires of anything uncached.
 *
 * The geography catalog is cached with `'use cache'` for a day, so every form
 * sharing it costs nothing.
 */
export const AddressList = async () => {
  const { userId } = await auth();

  if (!userId) redirect('/login');

  const [addresses, catalog] = await Promise.all([
    getAddresses(),
    getLocationCatalog(),
  ]);

  const addButton = <AddressFormDialog catalog={catalog} />;

  if (addresses.length === 0) {
    return (
      <Container className='py-16'>
        <AddressEmpty action={addButton} />
      </Container>
    );
  }

  return (
    <Container className='py-8'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <p className='text-heading/70 text-sm'>
            {addresses.length === 1
              ? '1 dirección guardada'
              : `${addresses.length} direcciones guardadas`}
          </p>

          {addButton}
        </div>

        {/* One column on a phone, two from md: these are read far more often
            on mobile than on a desktop. */}
        <ul
          aria-label='Direcciones guardadas'
          className='grid gap-4 md:grid-cols-2'
        >
          {addresses.map((address) => (
            <li key={address.id}>
              <AddressCard address={address} catalog={catalog} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};
