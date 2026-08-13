import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';
import {
  PRICE_MAX,
  PRICE_MIN,
  productSearchParams,
} from '../constants/product-search-params';
import type {
  ProductSortBy,
  ProductSortOrder,
} from '../type/product.interface';

type UseProductFilterOptions = {
  onFilterApplied?: () => void;
};

export const useProductFilter = ({
  onFilterApplied,
}: UseProductFilterOptions = {}) => {
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(productSearchParams, {
    shallow: false,
    startTransition,
  });

  /**
   * Every filter change resets `page`. Page 4 of an unfiltered catalog is not
   * page 4 of the filtered one — keeping it lands the user on an empty grid.
   */
  const handleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      categoryId: prev.categoryId === categoryId ? null : categoryId,
      departmentId: null,
      page: null,
    }));
    onFilterApplied?.();
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setFilters((prev) => ({
      departmentId: prev.departmentId === departmentId ? null : departmentId,
      categoryId: null,
      page: null,
    }));
    onFilterApplied?.();
  };

  const handleFeaturedProduct = (isFeatured: boolean) => {
    setFilters((prev) => ({
      featured: prev.featured === isFeatured ? null : isFeatured,
      page: null,
    }));
    onFilterApplied?.();
  };

  const handlePriceFilter = (minPrice: number, maxPrice: number) => {
    setFilters({ minPrice, maxPrice, page: null });
    onFilterApplied?.();
  };

  const handleSort = (sortBy: ProductSortBy, sortOrder: ProductSortOrder) => {
    setFilters({ sortBy, sortOrder, page: null });
    onFilterApplied?.();
  };

  const handlePageSize = (limit: number) => {
    setFilters({ limit, page: null });
    onFilterApplied?.();
  };

  const clearAllFilter = () => {
    setFilters({
      categoryId: null,
      departmentId: null,
      featured: null,
      maxPrice: null,
      minPrice: null,
      sortBy: null,
      sortOrder: null,
      page: null,
    });
    onFilterApplied?.();
  };

  const hasPriceFilter =
    filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX;

  const activeFilterCount = [
    filters.categoryId,
    filters.departmentId,
    filters.featured,
    hasPriceFilter || null,
  ].filter(Boolean).length;

  const hasActiveFilter = activeFilterCount > 0;

  return {
    clearAllFilter,
    hasActiveFilter,

    activeFilterCount,
    handleCategoryFilter,
    handleFeaturedProduct,
    handlePriceFilter,
    handleDepartmentFilter,
    handlePageSize,
    handleSort,
    filters,
    isPending,
  };
};
