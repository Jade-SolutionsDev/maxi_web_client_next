import { Section } from '@/app/components/layout/Section';
import { Skeleton } from '@/app/components/ui/skeleton';
import { departmentGridClass } from './department-grid.styles';

const PLACEHOLDERS = ['a', 'b', 'c'];

function DepartmentSectionSkeleton() {
  return (
    <Section label='Departamentos'>
      <ul className={departmentGridClass}>
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
