import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import { ProductCard } from '@/feature/product/components/ProductCard';
import {
  productCardSizes,
  productGridClass,
} from '@/feature/product/components/product-grid.styles';
import { getProducts } from '@/feature/product/service/product.service';

async function FeaturedProducts() {
  const products = await getProducts({
    featured: true,
  });

  return (
    <Section
      title='Productos destacados'
      action={{ href: '/catalog', label: 'Ver todos →' }}
    >
      {!products.length ? (
        <EmptyState
          title='Aún no hay productos destacados'
          description='Cuando destaquemos productos, vas a verlos acá primero. Mientras tanto, explorá todo el catálogo.'
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
