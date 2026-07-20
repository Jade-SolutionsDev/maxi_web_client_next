import Image from 'next/image';
import Link from 'next/link';
import emptyStateIllustration from '@/assets/empty-state.svg';
import { cn } from '@/lib/utils';

type EmptyStateAction = {
  href: string;
  label: string;
};

type EmptyStateProps = {
  /** Primary line: what would normally be here (e.g. "Aún no hay productos destacados"). */
  title: string;
  /** Secondary line: why it matters or what to expect. Kept short and reassuring. */
  description?: string;
  /** Optional CTA that moves the user toward value. */
  action?: EmptyStateAction;
  className?: string;
};

/**
 * Neutral empty state for data-driven sections. Mirrors the visual vocabulary
 * of `SectionErrorFallback` (surface panel, centered stack) so an empty section
 * and a failed section feel like the same system, and teaches the user what
 * belongs here instead of leaving blank space.
 */
export const EmptyState = ({
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <Image
        src={emptyStateIllustration}
        alt=''
        aria-hidden='true'
        className='h-auto w-28 opacity-90 sm:w-32'
      />

      <div className='flex max-w-sm flex-col gap-1.5'>
        <p className='text-base font-bold text-heading'>{title}</p>
        {description && <p className='text-sm text-muted'>{description}</p>}
      </div>

      {action && (
        <Link
          href={action.href}
          className='mt-1 inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white bg-accent outline-none transition hover:brightness-90 focus-visible:ring-2 focus-visible:ring-primary/40'
        >
          {action.label}
        </Link>
      )}
    </div>
  );
};
