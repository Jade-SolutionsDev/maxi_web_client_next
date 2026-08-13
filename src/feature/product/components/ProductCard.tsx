'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { QuantityStepper } from '@/app/components/ui/quantity-stepper';
import { SafeImage } from '@/app/components/ui/safe-image';
import { useFlyToCart } from '@/feature/cart/flight/useFlyToCart';
import { useCartActions } from '@/feature/cart/hook/useCart';
import { buildProductDetailHref } from '@/feature/product/constants/product-detail-href';
import { notifyStockLimit } from '@/feature/product/feedback/stock-limit.notify';
import type { Product } from '@/feature/product/type/product.interface';
import { formatDiscount } from '@/helpers';
import { computePreviousPrice } from '@/lib/product-price';
import { ProductPrice } from './ProductPrice';

type ProductCardProps = {
  product: Product;
  /** Responsive `sizes` hint for next/image, derived from the grid the card lives in. */
  imageSizes?: string;
};

function ProductCard({ product, imageSizes = '100vw' }: ProductCardProps) {
  const { name, price, image, available } = product;

  const { addToCart } = useCartActions();
  const flyToCart = useFlyToCart();
  /** Quantity picked before adding; the cart owns the quantity once added. */
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const discount = product.discount ?? 0;
  const previousPrice = computePreviousPrice(price, discount);

  const handleAddToCart = () => {
    // Fired on the click, not on the response: the animation acknowledges the
    // intent. A rejected add is corrected by the toast and the cart re-read.
    flyToCart({ sourceEl: imageRef.current });
    setQuantity(1);

    void addToCart(product, quantity).then((added) => {
      if (added < quantity) notifyStockLimit(product);
    });
  };

  return (
    <article className='@container group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none'>
      <Link
        href={buildProductDetailHref(product)}
        className='flex flex-1 flex-col rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
      >
        <div className='relative flex aspect-4/3 items-center justify-center overflow-hidden bg-background p-2'>
          {previousPrice !== null && (
            <span className='absolute top-2 left-2 z-10 rounded-full bg-orange px-2 py-0.5 text-[11px] font-semibold text-white'>
              {formatDiscount(discount)}
            </span>
          )}
          <div className='relative h-full w-full'>
            <SafeImage
              ref={imageRef}
              src={image}
              alt={name}
              fill
              sizes={imageSizes}
              className='object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none'
            />
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-1 p-3 pb-0'>
          <h3 className='  line-clamp-3 text-sm font-semibold text-heading leading-snug'>
            {name}
          </h3>

          <ProductPrice
            price={price}
            discount={product.discount}
            size='sm'
            className='mt-auto'
          />
        </div>
      </Link>

      <div className='p-3 pt-2'>
        <div className='flex flex-col gap-1.5 @[13rem]:flex-row @[13rem]:items-stretch'>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            onLimitReached={() => notifyStockLimit(product)}
            min={1}
            variant='surface'
            max={available}
            itemLabel={name}
            className='shrink-0'
          />
          <Button
            type='button'
            onClick={handleAddToCart}
            className='min-w-0 gap-1.5 truncate px-2.5 py-2 text-sm font-semibold @[13rem]:flex-1'
            aria-label={`Añadir ${quantity} ${name} al carrito`}
          >
            <ShoppingCart className='size-4 shrink-0' aria-hidden='true' />
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
