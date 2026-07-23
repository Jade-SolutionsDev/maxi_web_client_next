'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SheetClose, SheetFooter } from '@/app/components/ui/sheet';
import { formatPrice } from '@/helpers';
import { useCartData } from '../hook/useCart';

export const CartFooter = () => {
  const { totalPrice } = useCartData();

  return (
    <SheetFooter className='gap-4 border-t border-input bg-white p-5'>
      <dl className='flex flex-col gap-3'>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-base text-muted'>Subtotal</dt>
          <dd className='text-base font-bold text-heading tabular-nums'>
            {formatPrice(totalPrice)}
          </dd>
        </div>

        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-lg font-bold text-heading'>Total</dt>
          <dd className='text-2xl font-bold text-total tabular-nums'>
            {formatPrice(totalPrice)}
          </dd>
        </div>
      </dl>

      {/* TODO: enlazar a /checkout cuando exista la ruta correspondiente. */}
      <Button size='lg' type='button' className='w-full gap-2'>
        Proceder al pago
        <ArrowRight className='size-4.5 shrink-0' aria-hidden='true' />
      </Button>

      <SheetClose
        render={
          <Button variant='outline' size='lg' type='button' className='w-full'>
            Seguir comprando
          </Button>
        }
      />
    </SheetFooter>
  );
};
