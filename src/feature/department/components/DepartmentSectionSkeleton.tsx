import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';

const PLACEHOLDERS = ['a', 'b', 'c'];

function DepartmentSectionSkeleton() {
  return (
    <Section label='Departamentos'>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {PLACEHOLDERS.map((id) => (
          <li key={id}>
            <Skeleton className='aspect-2184/1146 w-full rounded-2xl' />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { DepartmentSectionSkeleton };
