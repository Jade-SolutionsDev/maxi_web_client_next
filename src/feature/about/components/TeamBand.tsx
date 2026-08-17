import { Container } from '@/app/components/layout/Container';
import { StaffCarousel } from '@/shared/cms/components/StaffCarousel';
import type { StaffMember } from '@/shared/cms/type/cms.interface';
import { TEAM_ID } from '../constants/about.constants';

export const TeamBand = ({ staff }: { staff: StaffMember[] }) => {
  if (staff.length === 0) return null;

  return (
    <section aria-labelledby={TEAM_ID} className='bg-surface py-14 sm:py-20'>
      <Container className='flex flex-col gap-10 sm:gap-12'>
        <h2
          id={TEAM_ID}
          className='text-center font-fredoka text-3xl font-bold text-balance text-heading sm:text-4xl'
        >
          Nuestro equipo
        </h2>
        <StaffCarousel staff={staff} />
      </Container>
    </section>
  );
};
