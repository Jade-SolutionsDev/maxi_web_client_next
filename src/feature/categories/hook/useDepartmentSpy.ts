'use client';

import { useEffect, useState } from 'react';
import { departmentAnchorId } from '../constants/categories-anchor';

const ROOT_MARGIN = '-40% 0px -50% 0px';

export const useDepartmentSpy = (slugs: string[]) => {
  const [activeSlug, setActiveSlug] = useState(slugs[0] ?? '');
  useEffect(() => {
    const entries = slugs
      .map((slug) => {
        const element = document.getElementById(departmentAnchorId(slug));
        return element ? ([slug, element] as const) : null;
      })
      .filter((entry) => entry !== null);

    if (entries.length === 0) return;

    setActiveSlug(entries[0][0]);

    const slugByElement = new Map<Element, string>(
      entries.map(([slug, element]) => [element, slug]),
    );

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        const slug = visible && slugByElement.get(visible.target);
        if (slug) setActiveSlug(slug);
      },
      { rootMargin: ROOT_MARGIN },
    );

    for (const [, element] of entries) observer.observe(element);

    return () => observer.disconnect();
  }, [slugs]);

  return activeSlug;
};
