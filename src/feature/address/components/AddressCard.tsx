'use client';

import { Check, Star } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '@/app/components/ui/button';
import type { LocationCatalog } from '@/shared/location/type/location.interface';
import { makeAddressDefault } from '../action/address.action';
import type { Address } from '../type/address.interface';
import { AddressDeleteDialog } from './AddressDeleteDialog';
import { AddressFormDialog } from './AddressFormDialog';

interface AddressCardProps {
  address: Address;
  catalog: LocationCatalog;
}

export const AddressCard = ({ address, catalog }: AddressCardProps) => {
  const [isPending, startTransition] = useTransition();

  const promote = () => {
    startTransition(async () => {
      await makeAddressDefault({ id: address.id });
    });
  };

  return (
    <article className='flex h-full flex-col gap-3 rounded-xl border border-heading/10 p-4'>
      <header className='flex items-start justify-between gap-2'>
        <h3 className='font-medium text-heading'>
          {address.label ?? 'Dirección'}
        </h3>

        {address.isDefault && (
          <span className='flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-accent text-xs'>
            <Star aria-hidden='true' className='size-3' />
            Predeterminada
          </span>
        )}
      </header>

      <div className='flex-1 space-y-1 text-heading/80 text-sm'>
        <p>{address.street}</p>
        {address.betweenStreets && <p>Entre {address.betweenStreets}</p>}
        {address.reference && (
          <p className='text-heading/60'>{address.reference}</p>
        )}
        <p className='text-heading/60'>
          {address.municipalityName}
          {address.provinceName && `, ${address.provinceName}`}
        </p>
        {address.contactPhone && (
          <p className='text-heading/60'>Tel. {address.contactPhone}</p>
        )}
      </div>

      <footer className='flex flex-wrap items-center gap-2 border-heading/10 border-t pt-3'>
        <AddressFormDialog address={address} catalog={catalog} />
        <AddressDeleteDialog address={address} />

        {/* Only the ones that are not the default offer promotion; the default
            already says so with its badge. */}
        {!address.isDefault && (
          <Button
            type='button'
            size='sm'
            variant='ghost'
            className='ml-auto'
            loading={isPending}
            onClick={promote}
          >
            <Check aria-hidden='true' className='size-4' />
            Usar como predeterminada
          </Button>
        )}
      </footer>
    </article>
  );
};
