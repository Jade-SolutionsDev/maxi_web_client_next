'use client';

import { Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import { Button } from '@/app/components/ui/button';
import { cancelOrderAction } from '../action/order.action';
import {
  notifyOrderCancelled,
  notifyPaymentFailure,
} from '../feedback/order.notify';

export const CancelOrderButton = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const result = await cancelOrderAction({ orderId });
    setIsLoading(false);
    setIsOpen(false);

    if (result.order) {
      notifyOrderCancelled();
      router.refresh();
      return;
    }
    notifyPaymentFailure(result.failure);
  };

  return (
    <>
      <Button
        type='button'
        variant='outline'
        onClick={() => setIsOpen(true)}
        className='gap-2 border-destructive/40 text-destructive hover:bg-destructive/10'
      >
        <Ban className='size-4 shrink-0' aria-hidden='true' />
        Cancelar pedido
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        icon={Ban}
        variant='warning'
        title='¿Cancelar este pedido?'
        description='Se libera el stock reservado y el pedido no podrá reactivarse.'
        submitText='Cancelar pedido'
        cancelText='Volver'
      />
    </>
  );
};
