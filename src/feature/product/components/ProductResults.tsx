import type { SearchParams } from 'nuqs/server';
import { EmptyState } from '@/app/components/feedback/EmptyState';
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
import { SortControl } from './filters/SortControl';
import { ProductCard } from './ProductCard';
import { catalogCardSizes, catalogGridClass } from './product-grid.styles';

type ProductResultsProps = {
  searchParams: Promise<SearchParams>;
};

const LIMIT_PRODUCT = 9;

export async function ProductResults({ searchParams }: ProductResultsProps) {
  const {
    q,
    departmentId,
    categoryId,
    featured,
    maxPrice,
    minPrice,
    sortBy,
    sortOrder,
  } = parseCatalogSearchParams(await searchParams);

  const products = await getProducts({
    q,
    departmentId,
    categoryId,
    featured,
    maxPrice,
    minPrice,
    sortBy: sortBy ?? DEFAULT_SORT_BY,
    sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
    limit: LIMIT_PRODUCT,
  });

  const count = products.length;

  return (
    <div
      id={CATALOG_RESULTS_ID}
      className={`flex-1 min-w-0 ${CATALOG_RESULTS_SCROLL_MARGIN}`}
    >
      <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <p className='text-sm text-muted'>
          Mostrando <span className='font-bold text-heading'>{count}</span>{' '}
          {count === 1 ? 'producto' : 'productos'}
          {q && (
            <>
              {' '}
              para <span className='font-bold text-heading'>«{q}»</span>
            </>
          )}
        </p>
        <div className='hidden md:block'>
          <SortControl />
        </div>
      </header>

      {count === 0 ? (
        q ? (
          <EmptyState
            title={`No encontramos productos para «${q}»`}
            description='Revisa la escritura o prueba con un término más corto.'
            action={{ href: CATALOG_PATH, label: 'Ver todo el catálogo' }}
          />
        ) : (
          <EmptyState
            title='No se encontraron productos'
            description='Todavía no hay productos para mostrar en el catálogo. Vuelve pronto.'
          />
        )
      ) : (
        <ul className={catalogGridClass}>
          {products.map((product) => (
            <li key={product.id} className='flex'>
              <ProductCard product={product} imageSizes={catalogCardSizes} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
