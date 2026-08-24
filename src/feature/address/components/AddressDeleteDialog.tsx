'use client';

import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import { Button } from '@/app/components/ui/button';
import { deleteAddress } from '../action/address.action';
import type { Address } from '../type/address.interface';

export const AddressDeleteDialog = ({ address }: { address: Address }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      await deleteAddress({ id: address.id });
      setIsOpen(false);
    });
  };

  const name = address.label ?? address.street;

  return (
    <>
      <Button
        type='button'
        size='sm'
        variant='ghost'
        onClick={() => setIsOpen(true)}
      >
        <Trash2 aria-hidden='true' className='size-4' />
        Borrar
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirm}
        isLoading={isPending}
        icon={Trash2}
        variant='warning'
        title='Borrar dirección'
        // Says plainly that history is safe: the fear here is losing past
        // orders, and the answer is no.
        description={`Se borrará «${name}». Los pedidos que ya hiciste conservan su dirección y no cambian.`}
        submitText='Borrar'
      />
    </>
  );
};
