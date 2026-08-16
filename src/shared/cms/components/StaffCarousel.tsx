'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import { SafeImage } from '@/app/components/ui/safe-image';
import { prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';
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
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { axis: 'y', loop: scrolls, align: 'start' },
    scrolls && !prefersReducedMotion()
      ? [Autoplay({ delay: AUTO_SCROLL_MS, stopOnInteraction: false })]
      : [],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

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
    <div className='mx-auto flex w-full max-w-2xl items-stretch gap-4'>
      <div className='relative min-w-0 flex-1'>
        <div ref={viewportRef} className='h-105 overflow-hidden'>
          <ul className='flex h-full flex-col'>
            {staff.map((member) => (
              <li key={member.id} className='min-h-0 flex-[0_0_33.333%] pb-4'>
                <StaffCard member={member} />
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background to-transparent'
        />
      </div>

      <div
        role='tablist'
        aria-label='Ir a un miembro del equipo'
        aria-orientation='vertical'
        className='flex flex-col items-center justify-center gap-2'
      >
        {staff.map((member, index) => (
          <button
            key={member.id}
            type='button'
            role='tab'
            aria-selected={index === selected}
            aria-label={`Ver a ${member.name}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'size-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              index === selected
                ? 'bg-accent'
                : 'bg-heading/20 hover:bg-heading/40',
            )}
          />
        ))}
      </div>
    </div>
  );
};
