'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import type { Product } from '@/feature/product/type/product.interface';
import { formatPrice } from '@/lib/format';
import { computePreviousPrice } from '@/lib/product-price';

type ProductPurchaseProps = {
  product: Product;
};

function ProductPurchase({ product }: ProductPurchaseProps) {
  const { name, price } = product;
  const [quantity, setQuantity] = useState(1);
  const discount = product.discount ?? 0;
  const previousPrice = computePreviousPrice(price, discount);

  const decrease = () => setQuantity((current) => Math.max(1, current - 1));
  const increase = () => setQuantity((current) => current + 1);

  return (
    <div className='space-y-4'>
      <p className='flex items-baseline gap-2'>
        <span className='text-3xl font-bold text-heading'>
          {formatPrice(price)}
        </span>
        {previousPrice !== null && (
          <span className='text-base text-muted line-through'>
            {formatPrice(previousPrice)}
          </span>
        )}
      </p>

      <div className='flex flex-col items-stretch gap-3 sm:flex-row'>
        <QuantityStepper
          value={quantity}
          onDecrease={decrease}
          onIncrease={increase}
          min={1}
          variant='surface'
          itemLabel={name}
          className='shrink-0'
        />
        <Button
          className='flex-1 gap-2'
          aria-label={`Añadir ${quantity} ${name} al carrito`}
        >
          <ShoppingCart className='size-5 shrink-0' aria-hidden='true' />
          Añadir al carrito
        </Button>
      </div>
    </div>
  );
}

export { ProductPurchase };
