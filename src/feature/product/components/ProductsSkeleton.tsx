import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';
import { productGridClass } from './product-grid.styles';

const PLACEHOLDERS = ['a', 'b', 'c', 'd', 'e'];

function ProductsSkeleton() {
  return (
    <Section
      title='Productos destacados'
      action={{ href: '/catalog', label: 'Ver todos →' }}
    >
      <ul className={productGridClass}>
        {PLACEHOLDERS.map((id) => (
          <li key={id} className='flex flex-col gap-2'>
            <Skeleton className='aspect-[4/3] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-5 w-1/2' />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { ProductsSkeleton };
