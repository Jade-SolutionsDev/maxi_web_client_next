'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { SheetClose, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { useCartData } from '../hook/useCart';
import { CartClearConfirmDialog } from './CartClearConfirmDialog';

export const CartHeader = () => {
  const { totalItems, totalLines } = useCartData();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const closeClearConfirm = () => setIsClearConfirmOpen(false);

  if (isClearConfirmOpen && totalLines === 0) {
    setIsClearConfirmOpen(false);
  }

  return (
    <>
      <SheetHeader className='bg-primary text-white'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2.5'>
            <ShoppingCart className='size-5 shrink-0' aria-hidden='true' />
            <SheetTitle className='text-base font-bold text-white'>
              Mi carrito
            </SheetTitle>
          </div>

          <SheetClose
            render={
              <Button
                variant='ghost'
                size='icon-sm'
                type='button'
                aria-label='Cerrar carrito'
                className='rounded-lg text-white hover:bg-white/15 focus-visible:ring-white/60'
              />
            }
          >
            <span aria-hidden='true' className='text-xl leading-none'>
              &times;
            </span>
          </SheetClose>
        </div>
      </SheetHeader>

      {totalLines > 0 && (
        <div className='flex items-center justify-between gap-3 border-b border-input px-5 py-2.5'>
          <span className='text-sm text-muted'>
            {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
          </span>

          <Button
            variant='ghost'
            type='button'
            onClick={() => setIsClearConfirmOpen(true)}
            className='gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-muted hover:bg-destructive/10 hover:text-destructive hover:brightness-100 focus-visible:ring-destructive/40'
          >
            <Trash2 className='size-4 shrink-0' aria-hidden='true' />
            Vaciar carrito
          </Button>
        </div>
      )}

      <CartClearConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={closeClearConfirm}
      />
    </>
  );
};
