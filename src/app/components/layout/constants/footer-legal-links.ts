import {
  cmsPageHref,
  PAYMENTS_PAGE_SLUG,
} from '@/feature/cms-page/constants/cms-page.constants';
import type {
  CmsPageLink,
  SiteLegalLink,
} from '@/shared/cms/type/cms.interface';
import type { FooterLink } from './footer.constants';

export const buildFooterLegalLinks = (
  legalLinks: SiteLegalLink[],
  cmsPages: CmsPageLink[],
): FooterLink[] => {
  const titleBySlug = new Map(cmsPages.map(({ slug, title }) => [slug, title]));

  const publishedLinks = legalLinks
    .filter(({ slug }) => titleBySlug.has(slug))
    .map(({ label, slug }) => ({ label, href: cmsPageHref(slug) }));

  const paymentsTitle = titleBySlug.get(PAYMENTS_PAGE_SLUG);
  const paymentsAlreadyListed = legalLinks.some(
    ({ slug }) => slug === PAYMENTS_PAGE_SLUG,
  );

  if (!paymentsTitle || paymentsAlreadyListed) return publishedLinks;

  return [
    ...publishedLinks,
    { label: paymentsTitle, href: cmsPageHref(PAYMENTS_PAGE_SLUG) },
  ];
};
