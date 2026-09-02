import { CATALOG_PATH } from '@/feature/product/constants/catalog-search-href';
import { SEARCH_QUERY_KEY } from '@/feature/product/constants/product-search-params';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { SITE_URL, absoluteUrl } from '../site-url';

const SITE_NAME = 'MaxiHabana';
const LOGO_PATH = '/icon.png';
const SEARCH_TERM_TOKEN = '{search_term_string}';

const digitsOnly = (value: string): string => value.replace(/[^+\d]/g, '');

const buildOrganizationLd = (phone: string, email: string) => {
  const contactPoint = (phone || email)
    ? {
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          ...(phone && { telephone: digitsOnly(phone) }),
          ...(email && { email }),
          areaServed: 'CU',
          availableLanguage: ['es'],
        },
      }
    : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    ...contactPoint,
  };
};

const buildWebsiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es-CU',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}${CATALOG_PATH}?${SEARCH_QUERY_KEY}=${SEARCH_TERM_TOKEN}`,
    },
    'query-input': `required name=search_term_string`,
  },
});

export async function SiteStructuredData() {
  const { contact } = await getSiteSettings();
  const payload = [
    buildOrganizationLd(contact.phone, contact.email),
    buildWebsiteLd(),
  ];

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
