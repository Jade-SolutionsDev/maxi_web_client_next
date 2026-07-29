import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const paginationItemVariants = cva(
  'inline-flex size-11 items-center justify-center rounded-xl text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40',
  {
    variants: {
      variant: {
        default:
          'bg-white text-heading shadow-sm hover:bg-surface hover:text-heading',
        active: 'bg-primary text-white shadow-none hover:brightness-95',
        disabled:
          'pointer-events-none bg-white text-muted opacity-40 shadow-sm',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label='Paginación de resultados'
      data-slot='pagination'
      className={cn('flex justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn(
        'flex flex-wrap items-center justify-center gap-2',
        className,
      )}
      {...props}
    />
  );
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = React.ComponentProps<typeof Link> &
  Pick<VariantProps<typeof paginationItemVariants>, 'variant'> & {
    isActive?: boolean;
  };

function PaginationLink({
  className,
  isActive = false,
  variant,
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      data-slot='pagination-link'
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        paginationItemVariants({
          variant: variant ?? (isActive ? 'active' : 'default'),
        }),
        className,
      )}
      {...props}
    />
  );
}

type PaginationArrowProps = Omit<
  PaginationLinkProps,
  'isActive' | 'variant'
> & {
  /** Renders an inert placeholder instead of a link on the first/last page. */
  disabled?: boolean;
};

/**
 * A dead end is rendered as a `<span>`, never as an anchor: an arrow that looks
 * clickable and goes nowhere is worse than one that reads as unavailable.
 */
function PaginationEdge({
  disabled,
  label,
  icon,
  className,
  ...props
}: PaginationArrowProps & { label: string; icon: React.ReactNode }) {
  if (disabled) {
    return (
      <span
        aria-hidden='true'
        className={cn(
          paginationItemVariants({ variant: 'disabled' }),
          className,
        )}
      >
        {icon}
      </span>
    );
  }

  return (
    <PaginationLink aria-label={label} className={className} {...props}>
      {icon}
    </PaginationLink>
  );
}

function PaginationPrevious(props: PaginationArrowProps) {
  return (
    <PaginationEdge
      label='Ir a la página anterior'
      icon={<ChevronLeftIcon className='size-5' />}
      {...props}
    />
  );
}

function PaginationNext(props: PaginationArrowProps) {
  return (
    <PaginationEdge
      label='Ir a la página siguiente'
      icon={<ChevronRightIcon className='size-5' />}
      {...props}
    />
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden='true'
      data-slot='pagination-ellipsis'
      className={cn(
        'flex size-11 items-center justify-center text-muted',
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon className='size-4' />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
