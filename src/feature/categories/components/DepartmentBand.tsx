'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import {
  categoryHref,
  departmentHref,
} from '@/feature/product/constants/catalog-taxonomy-href';
import { cn } from '@/lib/utils';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';
import {
  DEPARTMENT_SCROLL_MARGIN,
  departmentAnchorId,
  departmentHeadingId,
} from '../constants/categories-anchor';
import { CategoryCard } from './CategoryCard';
import { gridClass, toggleClass } from './categories-directory.styles';

type DepartmentBandProps = {
  group: TaxonomyGroup;
  isFiltering: boolean;
  isFirst: boolean;
};

const GRID_SIZES =
  '(max-width: 640px) 30vw, (max-width: 768px) 22vw, (max-width: 1024px) 18vw, 200px';

export const DepartmentBand = ({
  group,
  isFiltering,
  isFirst,
}: DepartmentBandProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const gridId = useId();
  const headingId = departmentHeadingId(group.slug);
  const isCollapsed = !isFiltering && !isExpanded;

  return (
    <section
      id={departmentAnchorId(group.slug)}
      aria-labelledby={headingId}
      className={cn(
        'category-band border-t border-input py-8 first:border-t-0 lg:py-10',
        DEPARTMENT_SCROLL_MARGIN,
      )}
    >
      <header className='mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1'>
        <h2
          id={headingId}
          className='font-fredoka text-xl font-semibold text-heading sm:text-2xl'
        >
          {group.name}
        </h2>

        <p className='text-sm text-muted tabular-nums'>
          {group.productsCount} productos
        </p>

        <Link
          href={departmentHref(group.slug)}
          className='ml-auto shrink-0 rounded-lg font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/50'
        >
          Ver todo →
        </Link>
      </header>

      <ul
        id={gridId}
        itemScope
        itemType='https://schema.org/ItemList'
        className={cn(gridClass, isCollapsed && 'category-grid-collapsed')}
      >
        {group.categories.map((category, index) => (
          <li
            key={category.id}
            itemProp='itemListElement'
            itemScope
            itemType='https://schema.org/ListItem'
          >
            <meta itemProp='position' content={String(index + 1)} />
            <meta itemProp='name' content={category.name} />
            <Link
              itemProp='url'
              href={categoryHref(category.slug)}
              className='block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            >
              <CategoryCard
                category={category}
                imageSizes={GRID_SIZES}
                productsCount={category.productsCount}
                priority={isFirst && index === 0}
              />
            </Link>
          </li>
        ))}
      </ul>

      {!isFiltering && (
        <button
          type='button'
          aria-expanded={isExpanded}
          aria-controls={gridId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className={toggleClass}
        >
          {isExpanded
            ? 'Ver menos'
            : `Ver las ${group.categories.length} categorías`}
        </button>
      )}
    </section>
  );
};
