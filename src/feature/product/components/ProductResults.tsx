import { EmptyState } from '@/app/components/feedback/EmptyState';
import type { CatalogSearchParams } from '../constants/product-search-params';
import { getProducts } from '../service/product.service';
import { ProductCard } from './ProductCard';

type ProductResultsProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export async function ProductResults({ searchParams }: ProductResultsProps) {
  const { departmentId, categoryId } = await searchParams;

  const products = await getProducts({ departmentId, categoryId });

  const count = products.length;

  return (
    <div className='flex-1 min-w-0'>
      <header className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <p className='text-sm text-muted'>
          Mostrando <span className='font-bold text-heading'>{count}</span>{' '}
          {count === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      {count === 0 ? (
        <EmptyState
          title='No se encontraron productos'
          description='Todavía no hay productos para mostrar en el catálogo. Vuelve pronto.'
        />
      ) : (
        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
