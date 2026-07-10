import { Section } from '@/app/components/layout/Section';
import { ProductCard } from '@/feature/product/components/ProductCard';
import { featuredProducts } from '@/feature/product/mock/products';

function FeaturedProducts() {
  return (
    <Section
      title='Productos destacados'
      action={{ href: '/productos', label: 'Ver todos →' }}
    >
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {featuredProducts.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { FeaturedProducts };
