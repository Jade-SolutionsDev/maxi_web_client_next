import { Section } from '@/app/components/layout/Section';
import { getFeaturedProducts } from '../service/product.service';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { ProductCard } from './ProductCard';

async function RecientProductSection() {
  const recentProdcut = await getFeaturedProducts({
    page: 1,
    size: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  return (
    <Section
      title='Nuestros productos más recientes'
      size={'full'}
      action={{ href: '/product', label: 'Ver todos →' }}
    >
      <Carousel
        loop
        autoplayDelay={1000}
        aria-label='Nuestros productos más recientes'
      >
        <CarouselContent className='-ml-4'>
          {recentProdcut.map((product) => (
            <CarouselItem
              key={product.id}
              className='pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5'
            >
              <ProductCard
                product={product}
                imageSizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}

export default RecientProductSection;
