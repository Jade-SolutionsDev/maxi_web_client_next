import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';

const PLACEHOLDERS = ['a', 'b', 'c', 'd', 'e'];

function ProductsSkeleton() {
  return (
    <Section
      title='Productos destacados'
      action={{ href: '/catalog', label: 'Ver todos →' }}
    >
      <ul className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
        {PLACEHOLDERS.map((id) => (
          <li key={id} className='flex flex-col gap-3'>
            <Skeleton className='aspect-square w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-5 w-1/2' />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { ProductsSkeleton };
