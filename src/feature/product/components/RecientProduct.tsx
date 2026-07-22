import Link from 'next/link';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { getProducts } from '../service/product.service';
import { ProductCard } from './ProductCard';

async function RecientProductSection() {
  const recentProducts = await getProducts({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <Section
      title='Nuestros productos más recientes'
      size={'full'}
      action={{ href: '/catalog', label: 'Ver todos →' }}
    >
      {recentProducts.length === 0 ? (
        <EmptyState
          title='Todavía no hay productos recientes'
          description='Estamos sumando productos nuevos al catálogo. Volvé pronto para ver las últimas novedades.'
          action={{ href: '/catalog', label: 'Ver todos los productos' }}
        />
      ) : (
        <Carousel
          loop
          autoplayDelay={3000}
          aria-label='Nuestros productos más recientes'
        >
          <CarouselContent className='-ml-4'>
            {recentProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className='pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5'
              >
                <Link href={`/catalog/${product.id}`}>
                  <ProductCard
                    product={product}
                    imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </Section>
  );
}

export default RecientProductSection;
