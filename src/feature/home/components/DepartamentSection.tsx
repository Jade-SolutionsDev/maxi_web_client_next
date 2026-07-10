import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/app/components/layout/Section';
import alimentos from '@/assets/Alimentos.webp';
import aseo from '@/assets/aseo.webp';
import combos from '@/assets/deparmanete-combo.webp';

const departments = [
  {
    name: 'Maxi Combos',
    href: '/departamentos/maxi-combos',
    image: combos,
  },
  {
    name: 'Alimentos y Bebidas',
    href: '/departamentos/alimentos-y-bebidas',
    image: alimentos,
  },
  {
    name: 'Aseo y Cuidado Personal',
    href: '/departamentos/aseo-y-cuidado-personal',
    image: aseo,
  },
];

function DepartamentSection() {
  return (
    <Section label='Departamentos'>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {departments.map((department) => (
          <li key={department.name}>
            <Link
              href={department.href}
              className='group block overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            >
              <Image
                src={department.image}
                alt={department.name}
                sizes='(max-width: 768px) 100vw, 33vw'
                className='h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { DepartamentSection };
