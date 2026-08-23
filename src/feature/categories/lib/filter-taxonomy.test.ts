import { describe, expect, it } from 'vitest';
import type {
  TaxonomyGroup,
  TaxonomyNode,
} from '@/shared/taxonomy/type/taxonomy.interface';
import { filterTaxonomyTree, withCategories } from './filter-taxonomy';

const node = (name: string): TaxonomyNode => ({
  id: name,
  name,
  slug: name.toLowerCase(),
  productsCount: 10,
});

const group = (name: string, categories: string[]): TaxonomyGroup => ({
  ...node(name),
  categories: categories.map(node),
});

const tree: TaxonomyGroup[] = [
  group('Panadería', ['Facturas', 'Pan del Día']),
  group('Lácteos', ['Leches', 'Yogures']),
  group('Bazar', []),
];

const names = (groups: TaxonomyGroup[]) => groups.map((item) => item.name);

const categoryNames = (groups: TaxonomyGroup[]) =>
  groups.flatMap((item) => item.categories.map((category) => category.name));

describe('withCategories', () => {
  it('drops departments with no categories', () => {
    expect(names(withCategories(tree))).toEqual(['Panadería', 'Lácteos']);
  });
});

describe('filterTaxonomyTree', () => {
  it('returns every populated department when the term is empty', () => {
    expect(names(filterTaxonomyTree(tree, '   '))).toEqual([
      'Panadería',
      'Lácteos',
    ]);
  });

  it('ignores accents on both sides of the comparison', () => {
    expect(names(filterTaxonomyTree(tree, 'panaderia'))).toEqual(['Panadería']);
  });

  it('keeps every category when the department name matches', () => {
    expect(categoryNames(filterTaxonomyTree(tree, 'lacteos'))).toEqual([
      'Leches',
      'Yogures',
    ]);
  });

  it('keeps only the matching categories otherwise', () => {
    const result = filterTaxonomyTree(tree, 'yog');

    expect(names(result)).toEqual(['Lácteos']);
    expect(categoryNames(result)).toEqual(['Yogures']);
  });

  it('returns nothing when the term matches no node', () => {
    expect(filterTaxonomyTree(tree, 'ferretería')).toEqual([]);
  });

  it('leaves the source tree untouched', () => {
    filterTaxonomyTree(tree, 'yog');

    expect(tree[1].categories).toHaveLength(2);
  });
});
