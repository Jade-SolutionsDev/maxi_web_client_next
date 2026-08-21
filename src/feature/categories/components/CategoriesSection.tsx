import Link from 'next/link';
import { EmptyState } from '@/app/components/feedback/EmptyState';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { CategoryCard } from '@/feature/categories/components/CategoryCard';
import { categoryHref } from '@/feature/product/constants/catalog-taxonomy-href';
import { getCategories } from '@/shared/taxonomy/service/taxonomy.service';

async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <Section
      title='Categorías'
      size='full'
      action={{ href: '/categorias', label: 'Ver todas →' }}
    >
      {categories.length === 0 ? (
        <EmptyState
          title='Todavía no hay categorías'
          description='Estamos organizando el catálogo en categorías para que encuentres todo más rápido.'
          action={{ href: '/catalog', label: 'Explorar productos' }}
        />
      ) : (
        <Carousel loop autoplayDelay={3000} aria-label='Categorías'>
          <CarouselContent className='-ml-4'>
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className='basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              >
                <Link
                  href={categoryHref(category.slug)}
                  className='cursor-pointer'
                >
                  <CategoryCard category={category} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </Section>
  );
}

export { CategoriesSection };
