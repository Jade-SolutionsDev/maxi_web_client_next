import type { MetadataRoute } from 'next';
import {
  cmsPageHref,
  PAYMENTS_PAGE_SLUG,
} from '@/feature/cms-page/constants/cms-page.constants';
import { departmentHref } from '@/feature/product/constants/catalog-taxonomy-href';
import { buildProductDetailHref } from '@/feature/product/constants/product-detail-href';
import { getProducts } from '@/feature/product/service/product.service';
import type { Product } from '@/feature/product/type/product.interface';
import { getSiteSettings } from '@/shared/cms/service/cms.service';
import { absoluteUrl } from '@/shared/seo/site-url';
import { getDepartments } from '@/shared/taxonomy/service/taxonomy.service';

const PRODUCT_PAGE_SIZE = 200;
const PRODUCT_PAGE_CAP = 100;

type Entry = MetadataRoute.Sitemap[number];

const staticEntries = (): Entry[] => [
  {
    url: absoluteUrl('/'),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: absoluteUrl('/catalog'),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/categorias'),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: absoluteUrl('/sobre-nosotros'),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: absoluteUrl('/contacto'),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

const departmentEntries = async (): Promise<Entry[]> => {
  try {
    const departments = await getDepartments();
    return departments.map((department) => ({
      url: absoluteUrl(departmentHref(department.slug)),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  } catch {
    return [];
  }
};

const cmsPageEntries = async (): Promise<Entry[]> => {
  try {
    const { footer } = await getSiteSettings();
    const slugs = new Set(footer.legalLinks.map(({ slug }) => slug));
    slugs.add(PAYMENTS_PAGE_SLUG);

    return [...slugs].map((slug) => ({
      url: absoluteUrl(cmsPageHref(slug)),
      changeFrequency: 'monthly',
      priority: 0.4,
    }));
  } catch {
    return [];
  }
};

const collectProducts = async (): Promise<Product[]> => {
  const collected: Product[] = [];

  for (let page = 1; page <= PRODUCT_PAGE_CAP; page += 1) {
    const { items, totalPages } = await getProducts({
      page,
      limit: PRODUCT_PAGE_SIZE,
      includeOutOfStock: true,
    });

    collected.push(...items);

    if (items.length === 0 || page >= totalPages) break;
  }

  return collected;
};

const productEntries = async (): Promise<Entry[]> => {
  try {
    const products = await collectProducts();
    return products.map((product) => ({
      url: absoluteUrl(buildProductDetailHref(product)),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, cmsPages, products] = await Promise.all([
    departmentEntries(),
    cmsPageEntries(),
    productEntries(),
  ]);

  return [...staticEntries(), ...departments, ...cmsPages, ...products];
}
