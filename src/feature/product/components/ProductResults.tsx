import type { SearchParams } from 'nuqs/server';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import {
  CATALOG_RESULTS_ID,
  CATALOG_RESULTS_SCROLL_MARGIN,
} from '../constants/catalog-anchor';
import { CATALOG_PATH } from '../constants/catalog-search-href';
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  parseCatalogSearchParams,
} from '../constants/product-search-params';
import { getProducts } from '../service/product.service';
import { CatalogResultsBar } from './CatalogResultsBar';
import { SortControl } from './filters/SortControl';
import { ProductCard } from './ProductCard';
import { catalogCardSizes, catalogGridClass } from './product-grid.styles';

type ProductResultsProps = {
  searchParams: Promise<SearchParams>;
};

export async function ProductResults({ searchParams }: ProductResultsProps) {
  const {
    q,
    department,
    category,
    featured,
    onSale,
    maxPrice,
    minPrice,
    sortBy,
    sortOrder,
    page,
    limit,
  } = parseCatalogSearchParams(await searchParams);

  const municipalityId = await readMunicipalityId();

  const {
    items: products,
    total,
    totalPages,
  } = await getProducts({
    q,
    departmentSlug: department,
    categorySlug: category,
    featured,
    onSale,
    maxPrice,
    minPrice,
    municipalityId: municipalityId ?? undefined,
    sortBy: sortBy ?? DEFAULT_SORT_BY,
    sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
    page,
    limit,
  });

  // A page past the end is reachable by hand-editing the url. Without this it
  // renders as a silent empty grid that looks like "no products exist".
  const isPageOutOfRange = total > 0 && products.length === 0;

  const emptyResultsTitle = q
    ? 'En breve tendremos productos'
    : category
      ? 'En breve tendremos productos para esta categoría'
      : department
        ? 'En breve tendremos productos para este departamento'
        : 'En breve tendremos productos';

  return (
    <div
      id={CATALOG_RESULTS_ID}
      className={`flex-1 min-w-0 ${CATALOG_RESULTS_SCROLL_MARGIN}`}
    >
      <header className='mb-6 flex flex-wrap items-center justify-end gap-4'>
        <div className='hidden md:block'>
          <SortControl />
        </div>
      </header>

      {isPageOutOfRange ? (
        <EmptyState
          title='Esta página ya no tiene productos'
          description='El catálogo cambió desde que llegaste aquí. Vuelve al principio para verlo completo.'
          action={{ href: CATALOG_PATH, label: 'Ir a la primera página' }}
        />
      ) : total === 0 ? (
        <EmptyState eyebrow='¡Muy pronto!' title={emptyResultsTitle} />
      ) : (
        <>
          <ul className={catalogGridClass}>
            {products.map((product) => (
              <li key={product.id} className='flex'>
                <ProductCard product={product} imageSizes={catalogCardSizes} />
              </li>
            ))}
          </ul>

          <CatalogResultsBar page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
