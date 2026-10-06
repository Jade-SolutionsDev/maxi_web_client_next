'use client';

import { Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from '@/app/components/form/ConfirmDialog';
import { Button } from '@/app/components/ui/button';
import { useCartActions } from '@/feature/cart/hook/useCart';
import { cancelOrderAction } from '../action/order.action';
import {
  notifyOrderCancelled,
  notifyPaymentFailure,
} from '../feedback/order.notify';

export const CancelOrderButton = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const { loadAccountCart } = useCartActions();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const result = await cancelOrderAction({ orderId });
    setIsLoading(false);
    setIsOpen(false);

    if (result.order) {
      notifyOrderCancelled();
      /**
       * Al cancelar, la API devuelve las líneas al carrito (MxH-0099). El
       * carrito vive en el cliente, así que `router.refresh()` no lo entera:
       * sin esto el cliente no ve sus productos hasta que recargue o cambie de
       * pestaña, y lo que ve mientras tanto es un carrito vacío — justo lo que
       * esta tarjeta viene a quitar.
       */
      void loadAccountCart();
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
        description='El pedido no podrá reactivarse, pero los productos vuelven a tu carrito para que no tengas que armarlo otra vez.'
        submitText='Cancelar pedido'
        cancelText='Volver'
      />
    </>
  );
};
