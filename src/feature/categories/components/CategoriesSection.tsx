import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { CategoryCard } from '@/feature/categories/components/CategoryCard';

import { getCategories } from '../service/categories.service';

async function CategoriesSection() {
  const categories = await getCategories();

  console.log('categorias', categories);

  return (
    <Section
      title='Categorías'
      size='full'
      action={{ href: '/categorias', label: 'Ver todas →' }}
    >
      {categories.length === 0 ? (
        <EmptyState
          title='Todavía no hay categorías'
          description='Estamos organizando el catálogo por categorías para que encuentres todo más rápido.'
          action={{ href: '/productos', label: 'Explorar productos' }}
        />
      ) : (
        <Carousel loop autoplayDelay={3000} aria-label='Categorías'>
          <CarouselContent className='-ml-4'>
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className='basis-1/3 pl-4 sm:basis-1/4 lg:basis-1/5'
              >
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </Section>
  );
}

export { CategoriesSection };
