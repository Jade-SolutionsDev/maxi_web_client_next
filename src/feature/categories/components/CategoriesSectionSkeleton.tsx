import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';

const PLACEHOLDERS = ['a', 'b', 'c', 'd', 'e'];

function CategoriesSectionSkeleton() {
  return (
    <Section
      title='Categorías'
      size='full'
      action={{ href: '/categorias', label: 'Ver todas →' }}
    >
      <ul className='flex gap-4 overflow-hidden'>
        {PLACEHOLDERS.map((id) => (
          <li
            key={id}
            className='flex shrink-0 basis-1/2 flex-col items-center gap-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
          >
            <Skeleton className='aspect-square w-full rounded-full' />
            <Skeleton className='h-3 w-2/3' />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { CategoriesSectionSkeleton };
