'use client';

import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { useCatalogFilterState } from './catalog-filters.context';
import { PriceFilter } from './PriceFilter';
import { TaxonomyFilterGroups } from './TaxonomyFilterGroups';

/**
 * Pure filter controls (price, departments, categories, featured). Owns no
 * chrome — the surrounding card (desktop) or sheet (mobile) provides layout.
 */
export const FilterGroups = () => {
  const { filters, handleFeaturedProduct } = useCatalogFilterState();

  return (
    <div className='flex flex-col gap-6'>
      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>Precio</h3>
        <PriceFilter />
      </section>

      <TaxonomyFilterGroups />

      <section>
        <h3 className='text-[16px] font-bold uppercase text-heading'>
          En oferta
        </h3>
        <div className='mt-4 flex items-center gap-3'>
          <Checkbox
            id='featured'
            checked={filters.featured === true}
            onCheckedChange={() => handleFeaturedProduct(!filters.featured)}
          />
          <Label htmlFor='featured'>Productos destacados</Label>
        </div>
      </section>
    </div>
  );
};
