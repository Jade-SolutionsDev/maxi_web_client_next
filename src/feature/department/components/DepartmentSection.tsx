import Image from 'next/image';
import Link from 'next/link';
import fallbackImage from '@/assets/fallback.jpeg';
import { Section } from '@/app/components/layout/Section';
import { getDepartments } from '../service/department.service';

async function DepartmentSection() {
  const departments = await getDepartments();

  return (
    <Section label='Departamentos'>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {departments.map((department) => (
          <li key={department.id}>
            <Link
              href={`/departamentos/${department.slug}`}
              className='group block overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            >
              <div className='relative aspect-2184/1146 w-full overflow-hidden rounded-2xl bg-primary/5'>
                <Image
                  src={department.imageDesktop ?? fallbackImage}
                  alt={department.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none'
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { DepartmentSection };
