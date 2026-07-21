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

  return (
    <Section
      title='Categories'
      size='full'
      action={{ href: '/categorias', label: 'View all →' }}
    >
      {categories.length === 0 ? (
        <EmptyState
          title='No categories yet'
          description='We are organizing the catalog into categories so you can find everything faster.'
          action={{ href: '/productos', label: 'Explore products' }}
        />
      ) : (
        <Carousel loop autoplayDelay={3000} aria-label='Categories'>
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
