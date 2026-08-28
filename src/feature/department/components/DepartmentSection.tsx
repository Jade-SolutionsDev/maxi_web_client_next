import { Section } from '@/app/components/layout/Section';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { readMunicipalityId } from '@/shared/location/cookie/location.cookie';
import { getDepartments } from '@/shared/taxonomy/service/taxonomy.service';
import { DepartmentCard } from './DepartmentCard';
import {
  departmentSlideClass,
  departmentTrackClass,
} from './department-carousel.styles';

async function DepartmentSection() {
  const municipalityId = await readMunicipalityId();
  const departments = await getDepartments({
    featured: true,
    municipalityId: municipalityId ?? undefined,
  });

  if (departments.length === 0) return null;

  return (
    <Section label='Departamentos'>
      <Carousel loop autoplayDelay={3000} aria-label='Departamentos'>
        <CarouselContent className={departmentTrackClass}>
          {departments.map((department) => (
            <CarouselItem key={department.id} className={departmentSlideClass}>
              <DepartmentCard department={department} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}

export { DepartmentSection };
