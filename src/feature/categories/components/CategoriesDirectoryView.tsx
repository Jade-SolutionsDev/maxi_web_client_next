'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Container } from '@/app/components/layout/Container';
import { CATALOG_PATH } from '@/feature/product/constants/catalog-search-href';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';
import { useDepartmentSpy } from '../hook/useDepartmentSpy';
import { filterTaxonomyTree } from '../lib/filter-taxonomy';
import { CategoryFilterField } from './CategoryFilterField';
import { railClass } from './categories-directory.styles';
import { DepartmentBand } from './DepartmentBand';
import { DepartmentPills } from './DepartmentPills';

type CategoriesDirectoryViewProps = {
  groups: TaxonomyGroup[];
};

export const CategoriesDirectoryView = ({
  groups,
}: CategoriesDirectoryViewProps) => {
  const [term, setTerm] = useState('');
  const deferredTerm = useDeferredValue(term);
  const isFiltering = deferredTerm.trim().length > 0;

  const visibleGroups = useMemo(
    () => filterTaxonomyTree(groups, deferredTerm),
    [groups, deferredTerm],
  );

  const slugs = useMemo(
    () => visibleGroups.map((group) => group.slug),
    [visibleGroups],
  );

  const activeSlug = useDepartmentSpy(slugs);

  return (
    <Container>
      <div className={railClass}>
        <CategoryFilterField value={term} onChange={setTerm} />
        {visibleGroups.length > 0 && (
          <DepartmentPills groups={visibleGroups} activeSlug={activeSlug} />
        )}
      </div>

      {visibleGroups.length === 0 ? (
        <EmptyState
          className='my-12'
          title='No encontramos esa categoría'
          description='Probá con otra palabra o mirá el catálogo completo.'
          action={{ href: CATALOG_PATH, label: 'Ver el catálogo' }}
        />
      ) : (
        visibleGroups.map((group, index) => (
          <DepartmentBand
            key={group.id}
            group={group}
            isFiltering={isFiltering}
            isFirst={index === 0}
          />
        ))
      )}
    </Container>
  );
};
