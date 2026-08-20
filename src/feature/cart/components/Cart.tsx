'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { useCartData } from '../hook/useCart';
import { useCartSync } from '../hook/useCartSync';
import { CartAnnouncer } from './CartAnnouncer';
import { CartEmpty } from './CartEmpty';
import { CartFooter } from './CartFooter';
import { CartHeader } from './CartHeader';
import { CartItemRow } from './CartRow';
import { CartTrigger } from './CartTrigger';

export const Cart = () => {
  useCartSync();

  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCartData();
  const hasItems = cartItems.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <CartAnnouncer />
      <CartTrigger />

      <SheetContent side='right' showCloseButton={false} className='p-0'>
        <CartHeader />

        {hasItems ? (
          <ul className='flex-1 divide-y divide-input overflow-y-auto px-5 py-4'>
            {cartItems.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </ul>
        ) : (
          <CartEmpty />
        )}

        {hasItems && <CartFooter closeSheet={() => setIsOpen(false)} />}
      </SheetContent>
    </Sheet>
  );
};
