'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { SafeImage } from '@/app/components/ui/safe-image';
import { prefersReducedMotion } from '@/lib/motion';
import type { StaffMember } from '@/shared/cms/type/cms.interface';

const AUTO_SCROLL_MS = 20_000;
const VISIBLE_ROWS = 3;

const StaffCard = ({ member }: { member: StaffMember }) => (
  <article className='flex h-full items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:gap-6 sm:p-5'>
    <div className='relative size-20 shrink-0 overflow-hidden rounded-full border border-black/5 bg-surface sm:size-24'>
      <SafeImage
        src={member.photo}
        alt={member.name}
        fill
        sizes='96px'
        className='object-cover'
      />
    </div>
    <div className='min-w-0 flex-1'>
      <h3 className='font-bold text-heading'>{member.name}</h3>
      <p className='text-sm font-medium text-accent'>{member.role}</p>
      {member.resume && (
        <p className='mt-1.5 line-clamp-3 text-sm text-muted'>
          {member.resume}
        </p>
      )}
    </div>
  </article>
);

export const StaffCarousel = ({ staff }: { staff: StaffMember[] }) => {
  const scrolls = staff.length > VISIBLE_ROWS;
  const [viewportRef] = useEmblaCarousel(
    { axis: 'y', loop: scrolls, align: 'start' },
    scrolls && !prefersReducedMotion()
      ? [Autoplay({ delay: AUTO_SCROLL_MS, stopOnInteraction: false })]
      : [],
  );

  if (!scrolls) {
    return (
      <ul className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
        {staff.map((member) => (
          <li key={member.id}>
            <StaffCard member={member} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={viewportRef}
      className='mx-auto h-[420px] w-full max-w-2xl overflow-hidden'
    >
      <ul className='flex h-full flex-col'>
        {staff.map((member) => (
          <li key={member.id} className='min-h-0 flex-[0_0_33.333%] pb-4'>
            <StaffCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
};
