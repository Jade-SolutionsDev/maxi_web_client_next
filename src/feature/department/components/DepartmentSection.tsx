import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import fallbackImage from '@/assets/fallback.jpeg';
import { getDepartments } from '../service/department.service';

async function DepartmentSection() {
  const departments = await getDepartments();

  return (
    <Section label='Departamentos'>
      <Carousel loop autoplayDelay={3000} aria-label='Departamentos'>
        <CarouselContent className='-ml-4'>
          {departments.map((department) => (
            <CarouselItem
              key={department.id}
              className='basis-full pl-4 md:basis-1/3'
            >
              <Link
                href={`/catalog?departmentId=${department.id}`}
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}

export { DepartmentSection };
