import type { Service } from '@/feature/home/type/service.interface';
import { cn } from '@/lib/utils';

type ServiceCardProps = {
  service: Service;
};

function ServiceCard({ service }: ServiceCardProps) {
  const { icon: Icon, title, description, featured } = service;

  return (
    <article
      className={cn(
        'flex h-full flex-col items-center gap-2 rounded-3xl px-6 py-10 text-center sm:px-8 lg:py-12',
        featured ? 'bg-surface' : 'bg-background',
      )}
    >
      <span
        className={cn(
          'mb-5 flex size-18 shrink-0 items-center justify-center rounded-full',
          featured ? 'bg-background' : 'bg-surface',
        )}
      >
        <Icon aria-hidden='true' className='size-7 text-accent' />
      </span>

      <h3 className='font-fredoka text-xl font-semibold text-heading'>
        {title}
      </h3>

      <p className='text-pretty text-sm text-muted'>{description}</p>
    </article>
  );
}

export { ServiceCard };
