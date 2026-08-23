import { CATALOG_PATH } from './catalog-search-href';

export const categoryHref = (slug: string) =>
  `${CATALOG_PATH}?category=${slug}`;

export const departmentHref = (slug: string) =>
  `${CATALOG_PATH}?department=${slug}`;
