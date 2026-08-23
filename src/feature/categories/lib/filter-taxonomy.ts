import { normalizeSearchText } from '@/helpers';
import type { TaxonomyGroup } from '@/shared/taxonomy/type/taxonomy.interface';

export const withCategories = (groups: TaxonomyGroup[]): TaxonomyGroup[] =>
  groups.filter((group) => group.categories.length > 0);

export const filterTaxonomyTree = (
  groups: TaxonomyGroup[],
  term: string,
): TaxonomyGroup[] => {
  const needle = normalizeSearchText(term);
  const populated = withCategories(groups);

  if (!needle) return populated;

  return populated.reduce<TaxonomyGroup[]>((matches, group) => {
    if (normalizeSearchText(group.name).includes(needle)) {
      matches.push(group);
      return matches;
    }

    const categories = group.categories.filter((category) =>
      normalizeSearchText(category.name).includes(needle),
    );

    if (categories.length > 0) matches.push({ ...group, categories });

    return matches;
  }, []);
};
