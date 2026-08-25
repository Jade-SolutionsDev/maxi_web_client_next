import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getProducts } from '../service/product.service';
import { ProductCard } from './ProductCard';

async function RecientProductSection() {
  const municipalityId = await readMunicipalityId();
  const { items: recentProducts } = await getProducts({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10,
    municipalityId: municipalityId ?? undefined,
  });

  return (
    <Section
      title='Nuestros productos más recientes'
      action={{ href: '/catalog', label: 'Ver todos →' }}
    >
      {recentProducts.length === 0 ? (
        <EmptyState
          title='Todavía no hay productos recientes'
          description='Estamos sumando productos nuevos al catálogo. Vuelve pronto para ver las últimas novedades.'
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
                className='pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6'
              >
                <ProductCard
                  product={product}
                  imageSizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 17rem'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </Section>
  );
}

export default RecientProductSection;
