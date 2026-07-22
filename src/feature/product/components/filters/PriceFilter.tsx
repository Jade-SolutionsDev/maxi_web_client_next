import { Slider } from '@/app/components/ui/slider';
import {
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
} from '../../constants/product-search-params';
import { useProductFilter } from '../../filters/catalog.filter';
import { formatPrice } from '@/lib/format';


export const PriceFilter = () => {
  const { filters, handlePriceFilter } = useProductFilter();

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Slider
        value={[filters.minPrice, filters.maxPrice]}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        minStepsBetweenValues={1}
        onValueChange={(value) => {
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
            {formatPrice(filters.minPrice)}
          </span>
        </span>
        <span>
          y{' '}
          <span className='font-bold text-heading'>
            {formatPrice(filters.maxPrice)}
          </span>
        </span>
      </div>
    </div>
  );
};
