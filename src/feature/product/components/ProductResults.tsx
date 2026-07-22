import Link from 'next/link';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import {
  type CatalogSearchParams,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../constants/product-search-params';
import { getProducts } from '../service/product.service';
import { SortControl } from './filters/SortControl';
import { ProductCard } from './ProductCard';

type ProductResultsProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export async function ProductResults({ searchParams }: ProductResultsProps) {
  const { departmentId, categoryId, featured, maxPrice, minPrice, sortBy, sortOrder } =
    await searchParams;

  const products = await getProducts({
    departmentId,
    categoryId,
    featured,
    maxPrice,
    minPrice,
    sortBy: sortBy ?? DEFAULT_SORT_BY,
    sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
  });

  const count = products.length;

  return (
    <div className='flex-1 min-w-0'>
      <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <p className='text-sm text-muted'>
          Mostrando <span className='font-bold text-heading'>{count}</span>{' '}
          {count === 1 ? 'producto' : 'productos'}
        </p>
        <div className='hidden md:block'>
          <SortControl />
        </div>
      </header>

      {count === 0 ? (
        <EmptyState
          title='No se encontraron productos'
          description='Todavía no hay productos para mostrar en el catálogo. Vuelve pronto.'
        />
      ) : (
        <ul className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product) => (
            <li key={product.id} className='flex'>
              <Link
                href={`/catalog/${product.id}`}
                className='block w-full min-w-0'
              >
                <ProductCard
                  product={product}
                  imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
