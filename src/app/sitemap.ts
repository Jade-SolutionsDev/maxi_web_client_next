import type { MetadataRoute } from 'next';
import {
  cmsPageHref,
  hasDedicatedRoute,
} from '@/feature/cms-page/constants/cms-page.constants';
import { departmentHref } from '@/feature/product/constants/catalog-taxonomy-href';
import { buildProductDetailHref } from '@/feature/product/constants/product-detail-href';
import { getProducts } from '@/feature/product/service/product.service';
import type { Product } from '@/feature/product/type/product.interface';
import { getCmsPages, hasFaqContent } from '@/shared/cms/service/cms.service';
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
  {
    url: absoluteUrl('/preguntas-frecuentes'),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

/**
 * Un bloque del sitemap que puede faltar sin tumbar el resto, **dejando
 * rastro**. Que estas listas se vaciaran en silencio es lo que mantuvo
 * invisible durante meses un sitemap sin una sola ficha de producto
 * (MxH-0172): la compilación terminaba bien y el XML era válido.
 */
const sinRomperElSitemap = async (
  bloque: string,
  construir: () => Promise<Entry[]>,
): Promise<Entry[]> => {
  try {
    return await construir();
  } catch (error) {
    console.error(
      `[sitemap] sin entradas de ${bloque}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return [];
  }
};

const departmentEntries = (): Promise<Entry[]> =>
  sinRomperElSitemap('departamentos', async () => {
    const departments = await getDepartments();
    return departments.map((department) => ({
      url: absoluteUrl(departmentHref(department.slug)),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  });

const cmsPageEntries = (): Promise<Entry[]> =>
  sinRomperElSitemap('páginas', async () => {
    const pages = await getCmsPages();

    return pages
      .filter(({ slug }) => !hasDedicatedRoute(slug))
      .map(({ slug }) => ({
        url: absoluteUrl(cmsPageHref(slug)),
        changeFrequency: 'monthly',
        priority: 0.4,
      }));
  });

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

const productEntries = (): Promise<Entry[]> =>
  sinRomperElSitemap('productos', async () => {
    const products = await collectProducts();
    return products.map((product) => ({
      url: absoluteUrl(buildProductDetailHref(product)),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, cmsPages, products] = await Promise.all([
    departmentEntries(),
    cmsPageEntries(),
    productEntries(),
  ]);

  // Same rule as the navigation: no published questions, no FAQ URL.
  const showFaq = await hasFaqContent();
  const statics = staticEntries().filter(
    (entry) => showFaq || !entry.url.endsWith('/preguntas-frecuentes'),
  );
  return [...statics, ...departments, ...cmsPages, ...products];
}
