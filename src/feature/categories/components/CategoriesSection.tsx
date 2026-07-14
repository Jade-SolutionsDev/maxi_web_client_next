import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { CategoryCard } from '@/feature/product/components/CategoryCard';

import { getCategories } from '../service/categories.service';

async function CategoriesSection() {
  const cetegories = await getCategories();

  return (
    <Section
      title='Categorías'
      size='full'
      action={{ href: '/categorias', label: 'Ver todas →' }}
    >
      <Carousel loop autoplayDelay={3000} aria-label='Categorías'>
        <CarouselContent className='-ml-4'>
          {cetegories.map((category) => (
            <CarouselItem
              key={category.id}
              className='basis-1/3 pl-4 sm:basis-1/4 lg:basis-1/5'
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}

export { CategoriesSection };
