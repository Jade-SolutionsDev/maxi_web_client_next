'use client';

import { ShoppingCart } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import {
  findFlightSource,
  PRODUCT_DETAIL_SOURCE,
} from '@/feature/cart/flight/flight-source';
import { useFlyToCart } from '@/feature/cart/flight/useFlyToCart';
import { useCartActions } from '@/feature/cart/hook/useCart';
import type { Product } from '@/feature/product/type/product.interface';

type ProductPurchaseProps = {
  product: Product;
};

function ProductPurchase({ product }: ProductPurchaseProps) {
  const { name } = product;
  const { addToCart } = useCartActions();
  const flyToCart = useFlyToCart();
  const [quantity, setQuantity] = useState(1);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);

    // The product photo lives in a server component alongside this one, so it
    // is found by attribute. The CTA is the fallback origin if it is missing.
    flyToCart({
      sourceEl: findFlightSource(PRODUCT_DETAIL_SOURCE) ?? buttonRef.current,
    });
  };

  return (
    <div className='flex flex-col items-stretch gap-3 sm:flex-row'>
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        min={1}
        variant='surface'
        size='lg'
        itemLabel={name}
        className='h-12 shrink-0 border border-black/5 bg-white px-1 shadow-sm'
      />
      <Button
        ref={buttonRef}
        type='button'
        onClick={handleAddToCart}
        className='h-12 flex-1 gap-2 text-base font-bold'
        aria-label={`Añadir ${quantity} ${name} al carrito`}
      >
        <ShoppingCart className='size-5 shrink-0' aria-hidden='true' />
        Añadir al carrito
      </Button>
    </div>
  );
}

export { ProductPurchase };
