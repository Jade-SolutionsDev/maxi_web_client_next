import { cn } from '@/lib/utils';

interface LocationBadgeProps {
  location: string;
  label?: string;
  className?: string;
}

export const LocationBadge = ({
  location,
  label = 'Disponible en:',
  className,
}: LocationBadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 bg-primary rounded-2xl px-5 py-3',
        className
      )}
    >
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        className='shrink-0'
      >
        <title>Location marker</title>
        <path
          d='M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z'
          fill='#F2603C'
        />
        <circle cx='12' cy='10' r='2.6' fill='#fff' />
      </svg>

      <div className='flex flex-col leading-tight'>
        <span className='text-white/80 text-xs'>{label}</span>
        <span className='text-white text-lg font-bold underline underline-offset-4'>
          {location}
        </span>
      </div>
    </div>
  );
};
