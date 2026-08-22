'use client';

import { useCartSync } from '../hook/useCartSync';
import { CartAnnouncer } from './CartAnnouncer';

export const CartSync = () => {
  useCartSync();

  return <CartAnnouncer />;
};
