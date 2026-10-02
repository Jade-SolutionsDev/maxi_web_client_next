import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import { ProductCard } from '@/feature/product/components/ProductCard';
import {
  productCardSizes,
  productGridClass,
} from '@/feature/product/components/product-grid.styles';
import { getFeaturedProducts } from '@/feature/product/service/product.service';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';

type FeaturedProductsProps = {
  productIds: string[];
};

async function FeaturedProducts({ productIds }: FeaturedProductsProps) {
  const municipalityId = await readMunicipalityId();
  const products = await getFeaturedProducts(
    productIds,
    municipalityId ?? undefined,
  );
  const isCurated = productIds.length > 0;

  return (
    <Section
      title='Productos destacados'
      action={
        isCurated
          ? undefined
          : { href: '/catalog?featured=true', label: 'Ver todos →' }
      }
    >
      {!products.length ? (
        <EmptyState
          title='Aún no hay productos destacados'
          description='Cuando destaquemos productos, los verás aquí primero. Mientras tanto, explora todo el catálogo.'
          action={{ href: '/catalog', label: 'Ver todos los productos' }}
        />
      ) : (
        <ul className={productGridClass}>
          {products.map((product) => (
            <li key={product.id} className='flex'>
              <ProductCard product={product} imageSizes={productCardSizes} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export { FeaturedProducts };
