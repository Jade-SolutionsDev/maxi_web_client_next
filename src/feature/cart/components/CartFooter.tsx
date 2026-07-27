'use client';

import { ArrowRight, PiggyBank } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SheetClose, SheetFooter } from '@/app/components/ui/sheet';
import { formatPrice } from '@/helpers';
import { useCartData } from '../hook/useCart';

export const CartFooter = () => {
  const { totalPrice, originalTotalPrice, totalSavings } = useCartData();
  const hasSavings = totalSavings > 0;

  return (
    <SheetFooter className='gap-4 border-t border-input bg-white p-5'>
      {hasSavings && (
        <p className='flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm font-semibold text-total'>
          <PiggyBank className='size-4.5 shrink-0' aria-hidden='true' />
          Estás ahorrando {formatPrice(totalSavings)} en esta compra
        </p>
      )}

      <dl className='flex flex-col gap-3'>
        <div className='flex items-baseline justify-between gap-3'>
          <dt className='text-base text-muted'>Subtotal</dt>
          <dd className='text-base font-bold text-heading tabular-nums'>
            {formatPrice(originalTotalPrice)}
          </dd>
        </div>

        {hasSavings && (
          <div className='flex items-baseline justify-between gap-3'>
            <dt className='text-base text-muted'>Descuentos</dt>
            <dd className='text-base font-bold text-total tabular-nums'>
              -{formatPrice(totalSavings)}
            </dd>
          </div>
        )}

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
