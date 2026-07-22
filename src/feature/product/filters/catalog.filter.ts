import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';
import { productSearchParams } from '../constants/product-search-params';

export const useProductFilter = () => {
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(productSearchParams, {
    shallow: false,
    startTransition,
  });

  const handleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      categoryId: prev.categoryId === categoryId ? null : categoryId,
    }));
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setFilters((prev) => ({
      departmentId: prev.departmentId === departmentId ? null : departmentId,
    }));
  };

  const handleFeaturedProduct = (isFeatured: boolean) => {
    setFilters((prev) => ({
      featured: prev.featured === isFeatured ? null : isFeatured,
    }));
  };

  const handlePriceFilter = (minPrice: number, maxPrice: number) => {
    setFilters({ minPrice, maxPrice });
  };

  const clearAllFilter = () => {
    setFilters({
      categoryId: null,
      departmentId: null,
      featured: null,
      maxPrice: null,
      minPrice: null,
    });
  };

  const activeFilterCount = [
    filters.categoryId,
    filters.departmentId,
    filters.featured,
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
    filters,
    isPending,
  };
};
