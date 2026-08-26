'use client';

import { useAuth } from '@clerk/nextjs';
import { ArrowRight, PiggyBank } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { SheetClose, SheetFooter } from '@/app/components/ui/sheet';
import { formatPrice } from '@/helpers';
import { notify } from '@/lib/notify';
import { useCartData } from '../hook/useCart';
import { useCartStore } from '../store/cart.store';

interface CartFooterProps {
  closeSheet: () => void;
}

export const CartFooter = ({ closeSheet }: CartFooterProps) => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const mode = useCartStore((state) => state.mode);
  const adoptGuestCart = useCartStore((state) => state.actions.adoptGuestCart);
  const [isPreparing, setIsPreparing] = useState(false);
  const {
    totalItems,
    totalPrice,
    originalTotalPrice,
    totalSavings,
    hasUnavailableLines,
  } = useCartData();
  const hasSavings = totalSavings > 0;

  const handleCheckout = async () => {
    if (!isSignedIn) {
      closeSheet();
      notify.info('Iniciá sesión para completar tu compra', {
        id: 'checkout-login',
        description: 'Tu carrito se conserva al iniciar sesión.',
      });
      router.push('/login');
      return;
    }

    if (mode === 'guest') {
      setIsPreparing(true);
      await adoptGuestCart();
      setIsPreparing(false);

      if (useCartStore.getState().mode === 'guest') {
        notify.error('No pudimos validar tu cuenta', {
          id: 'checkout-account',
          description:
            'Cierra sesión, vuelve a entrar e inténtalo de nuevo. Si sigue fallando, contáctanos.',
        });
        return;
      }
    }

    closeSheet();
    router.push('/checkout');
  };

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

      {hasUnavailableLines && (
        <p className='rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive'>
          Ajusta o quita los productos sin stock para continuar.
        </p>
      )}

      <Button
        size='lg'
        type='button'
        disabled={hasUnavailableLines || totalItems === 0 || !isLoaded}
        loading={isPreparing}
        onClick={handleCheckout}
        className='w-full gap-2'
      >
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
