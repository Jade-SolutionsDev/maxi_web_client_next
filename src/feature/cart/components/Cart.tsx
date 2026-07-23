'use client';

import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { useCartData } from '../hook/useCart';
import { CartAnnouncer } from './CartAnnouncer';
import { CartEmpty } from './CartEmpty';
import { CartFooter } from './CartFooter';
import { CartHeader } from './CartHeader';
import { CartItemRow } from './CartRow';
import { CartTrigger } from './CartTrigger';

export const Cart = () => {
  const { cartItems } = useCartData();
  const hasItems = cartItems.length > 0;

  return (
    <Sheet>
      <CartAnnouncer />
      <CartTrigger />

      <SheetContent side='right' showCloseButton={false} className='p-0'>
        <CartHeader />

        {hasItems ? (
          <ul className='flex-1 divide-y divide-input overflow-y-auto px-5 py-4'>
            {cartItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <CartEmpty />
        )}

        {hasItems && <CartFooter />}
      </SheetContent>
    </Sheet>
  );
};
