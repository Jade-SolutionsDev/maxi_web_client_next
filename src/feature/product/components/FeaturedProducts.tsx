import Link from 'next/link';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import { ProductCard } from '@/feature/product/components/ProductCard';
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
        <ul className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
          {products.map((product) => (
            <Link href={`/catalog/${product.id}`} key={product.id}>
              <li>
                <ProductCard
                  product={product}
                  imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
                />
              </li>
            </Link>
          ))}
        </ul>
      )}
    </Section>
  );
}

export { FeaturedProducts };
