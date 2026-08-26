import 'server-only';

import { departmentHref } from '@/feature/product/constants/catalog-taxonomy-href';
import { getDepartments } from '@/shared/taxonomy/service/taxonomy.service';
import type { FooterLink } from './footer.constants';

const FOOTER_DEPARTMENTS_LIMIT = 5;

export const getFooterDepartmentLinks = async (): Promise<FooterLink[]> => {
  try {
    const departments = await getDepartments();

    return departments
      .slice(0, FOOTER_DEPARTMENTS_LIMIT)
      .map(({ name, slug }) => ({ label: name, href: departmentHref(slug) }));
  } catch {
    return [];
  }
};
