import {
  categoryHref,
  departmentHref,
} from '@/feature/product/constants/catalog-taxonomy-href';
import { buildProductDetailHref } from '@/feature/product/constants/product-detail-href';
import type { CmsBannerTarget } from '@/shared/cms/type/cms.interface';

/** Keeps banner navigation aligned with the catalog's canonical route helpers. */
export const bannerTargetHref = (
  target: CmsBannerTarget | null,
): string | null => {
  if (!target) return null;

  switch (target.type) {
    case 'product':
      return buildProductDetailHref(target);
    case 'category':
      return categoryHref(target.slug);
    case 'department':
      return departmentHref(target.slug);
    default:
      return null;
  }
};
