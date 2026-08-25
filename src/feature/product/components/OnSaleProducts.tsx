import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getFreshProducts } from '../service/product.service';
import { ProductCard } from './ProductCard';

const ON_SALE_CATALOG_HREF = '/catalog?onSale=true';

export async function OnSaleProducts() {
  const municipalityId = await readMunicipalityId();
  const { items: onSaleProducts } = await getFreshProducts({
    onSale: true,
    limit: 10,
    municipalityId: municipalityId ?? undefined,
  });

  return (
    <Section
      title='En oferta'
      action={{ href: ON_SALE_CATALOG_HREF, label: 'Ver todos →' }}
    >
      {onSaleProducts.length === 0 ? (
        <EmptyState
          title='Todavía no hay productos en oferta'
          description='Estamos preparando nuevos descuentos. Vuelve pronto para aprovecharlos.'
          action={{ href: '/catalog', label: 'Ver todos los productos' }}
        />
      ) : (
        <Carousel loop autoplayDelay={3000} aria-label='Productos en oferta'>
          <CarouselContent className='-ml-4'>
            {onSaleProducts.map((product) => (
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
