export const TITLE_ID = 'cms-page-titulo';

export const PAYMENTS_PAGE_SLUG = 'metodos-de-pagos';

export const ABOUT_PAGE_SLUG = 'sobre-nosotros';

export const CONTACT_PAGE_SLUG = 'contacto';

const DEDICATED_PAGE_HREFS: Record<string, string> = {
  [ABOUT_PAGE_SLUG]: '/sobre-nosotros',
  [CONTACT_PAGE_SLUG]: '/contacto',
};

export const hasDedicatedRoute = (slug: string) =>
  Object.hasOwn(DEDICATED_PAGE_HREFS, slug);

export const cmsPageHref = (slug: string) =>
  hasDedicatedRoute(slug) ? DEDICATED_PAGE_HREFS[slug] : `/paginas/${slug}`;
