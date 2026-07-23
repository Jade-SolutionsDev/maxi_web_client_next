import { useEffect, useState } from 'react';
import { Slider } from '@/app/components/ui/slider';
import { formatPrice } from '@/helpers';
import {
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
} from '../../constants/product-search-params';
import { useProductFilter } from '../../filters/catalog.filter';

export const PriceFilter = () => {
  const { filters, handlePriceFilter } = useProductFilter();
  // Local state drives the visual thumbs on every drag tick; the filter
  // store (and the URL) is only updated on release via `onValueCommitted`,
  // otherwise every tick would trigger a navigation.
  const [localValue, setLocalValue] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  useEffect(() => {
    setLocalValue([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Slider
        value={localValue}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        minStepsBetweenValues={1}
        onValueChange={(value) => {
          if (Array.isArray(value)) {
            setLocalValue(value as [number, number]);
          }
        }}
        onValueCommitted={(value) => {
          if (Array.isArray(value)) {
            const [min, max] = value;
            handlePriceFilter(min, max);
          }
        }}
      />

      <div className='flex items-center justify-between text-sm text-muted'>
        <span>
          Entre{' '}
          <span className='font-bold text-heading'>
            {formatPrice(localValue[0])}
          </span>
        </span>
        <span>
          y{' '}
          <span className='font-bold text-heading'>
            {formatPrice(localValue[1])}
          </span>
        </span>
      </div>
    </div>
  );
};
