import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { type ApiResponse, api, type Paginated } from '@/api/http';
import { pickByIds } from '@/helpers';
import { toTaxonomy, toTaxonomyGroup } from '../adapter/taxonomy.adapter';
import type {
  CatalogDepartmentResponse,
  Taxonomy,
  TaxonomyFilters,
  TaxonomyGroup,
  TaxonomyResponse,
} from '../type/taxonomy.interface';

export const TAXONOMY_TREE_TAG = 'taxonomy-tree';

export const TAXONOMY_TAG = 'taxonomy';

const getTaxonomy = async (
  path: string,
  { featured, municipalityId }: TaxonomyFilters,
): Promise<Taxonomy[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(TAXONOMY_TAG);

  const { data } = await api<ApiResponse<Paginated<TaxonomyResponse>>>(path, {
    params: { featured, municipalityId },
  });

  return data.items.map(toTaxonomy);
};

export const getDepartments = (
  filters: TaxonomyFilters = {},
): Promise<Taxonomy[]> => getTaxonomy('/public/departments', filters);

export const getFeaturedDepartments = async (
  departmentIds: string[],
  municipalityId?: string,
): Promise<Taxonomy[]> => {
  if (!departmentIds.length) {
    return getDepartments({ featured: true, municipalityId });
  }
  return pickByIds(await getDepartments({ municipalityId }), departmentIds);
};

export const getCategories = (
  filters: TaxonomyFilters = {},
): Promise<Taxonomy[]> => getTaxonomy('/public/categories', filters);

export const getTaxonomyTree = async (
  municipalityId?: string,
): Promise<TaxonomyGroup[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(TAXONOMY_TREE_TAG);

  const { data } = await api<ApiResponse<CatalogDepartmentResponse[]>>(
    '/public/catalog',
    { params: { municipalityId } },
  );

  return data.map(toTaxonomyGroup);
};
