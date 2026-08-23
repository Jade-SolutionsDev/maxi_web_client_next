'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';
import { departmentAnchorId } from '../constants/categories-anchor';
import { pillClass, pillsClass } from './categories-directory.styles';

type DepartmentPillsProps = {
  groups: TaxonomyGroup[];
  activeSlug: string;
};

const pillId = (slug: string) => `pastilla-${slug}`;

export const DepartmentPills = ({
  groups,
  activeSlug,
}: DepartmentPillsProps) => {
  useEffect(() => {
    document.getElementById(pillId(activeSlug))?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [activeSlug]);

  return (
    <nav className={pillsClass} aria-label='Departamentos'>
      {groups.map((group) => (
        <a
          key={group.id}
          id={pillId(group.slug)}
          href={`#${departmentAnchorId(group.slug)}`}
          aria-current={group.slug === activeSlug}
          className={pillClass}
        >
          {group.name}
        </a>
      ))}
    </nav>
  );
};
