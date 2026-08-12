import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toTaxonomy, toTaxonomyGroup } from '../adapter/taxonomy.adapter';
import type {
  CatalogDepartmentResponse,
  Taxonomy,
  TaxonomyFilters,
  TaxonomyGroup,
  TaxonomyResponse,
} from '../type/taxonomy.interface';

export const TAXONOMY_TREE_TAG = 'taxonomy-tree';

const getTaxonomy = async (
  path: string,
  { featured }: TaxonomyFilters,
): Promise<Taxonomy[]> => {
  const { data } = await api<ApiResponse<Paginated<TaxonomyResponse>>>(path, {
    params: { featured },
  });

  return data.items.map(toTaxonomy);
};

export const getDepartments = (
  filters: TaxonomyFilters = {},
): Promise<Taxonomy[]> => getTaxonomy('/public/departments', filters);

export const getCategories = (
  filters: TaxonomyFilters = {},
): Promise<Taxonomy[]> => getTaxonomy('/public/categories', filters);

export const getTaxonomyTree = async (): Promise<TaxonomyGroup[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(TAXONOMY_TREE_TAG);

  const { data } =
    await api<ApiResponse<CatalogDepartmentResponse[]>>('/public/catalog');

  return data.map(toTaxonomyGroup);
};
