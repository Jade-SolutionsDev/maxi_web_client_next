import 'server-only';

import { type ApiResponse, api, type Paginated } from '@/api/http';
import { toTaxonomy } from '../adapter/taxonomy.adapter';
import type {
  Taxonomy,
  TaxonomyFilters,
  TaxonomyResponse,
} from '../type/taxonomy.interface';

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
