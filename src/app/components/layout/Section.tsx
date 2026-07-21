import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

type SectionAction = {
  href: string;
  label: string;
};

interface SectionProps {
  /** Visible heading. When set, the section is labelled by it. */
  title?: string;
  /** Explicit heading id; derived from `title` when omitted. */
  titleId?: string;
  /** Accessible name used when there is no visible `title`. */
  label?: string;
  /** Optional trailing link in the header (e.g. "Ver todos →"). */
  action?: SectionAction;
  /** Max-width variant forwarded to the inner Container. */
  size?: ComponentProps<typeof Container>['size'];
  /**
   * Layout for the section body. `'row'` stacks on mobile and becomes a
   * sidebar + content row from `md:` up; `'col'` keeps children stacked.
   * Omit to render children without a flex wrapper.
   */
  direction?: 'row' | 'col';
  className?: string;
  children: ReactNode;
}

const bodyDirection = {
  row: 'flex flex-col gap-6 md:flex-row',
  col: 'flex flex-col gap-6',
} as const;

const toId = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

export const Section = ({
  title,
  titleId,
  label,
  action,
  size,
  direction,
  className,
  children,
}: SectionProps) => {
  const headingId = title ? (titleId ?? toId(title)) : undefined;

  return (
    <section
      aria-label={title ? undefined : label}
      aria-labelledby={headingId}
      className={cn('py-8', className)}
    >
      <Container size={size}>
        {title && (
          <header className='mb-6 flex items-center justify-between gap-4'>
            <h2 id={headingId} className='text-2xl font-bold text-heading'>
              {title}
            </h2>
            {action && (
              <Link
                href={action.href}
                className='shrink-0 font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/50'
              >
                {action.label}
              </Link>
            )}
          </header>
        )}

        {direction ? (
          <div className={bodyDirection[direction]}>{children}</div>
        ) : (
          children
        )}
      </Container>
    </section>
  );
};
