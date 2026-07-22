import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsTone = 'default' | 'inverted';

export interface BreadcrumbsProps {
  items: Crumb[];

  label?: string;

  tone?: BreadcrumbsTone;
  className?: string;
}

const toneStyles: Record<
  BreadcrumbsTone,
  { list: string; link: string; current: string; separator: string }
> = {
  default: {
    list: 'text-muted',
    link: 'hover:text-accent focus-visible:ring-primary/50',
    current: 'text-heading',
    separator: 'text-muted/60',
  },
  inverted: {
    list: 'text-white/70',
    link: 'hover:text-white focus-visible:ring-white/60',
    current: 'text-white',
    separator: 'text-white/50',
  },
};

export const Breadcrumbs = ({
  items,
  label = 'Migas de pan',
  tone = 'default',
  className,
}: BreadcrumbsProps) => {
  const styles = toneStyles[tone];

  return (
    <nav aria-label={label} className={cn('text-sm', className)}>
      <ol
        itemScope
        itemType='https://schema.org/BreadcrumbList'
        className={cn('flex flex-wrap items-center gap-1.5', styles.list)}
      >
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li
                itemProp='itemListElement'
                itemScope
                itemType='https://schema.org/ListItem'
                className='inline-flex items-center'
              >
                {isCurrent || !item.href ? (
                  <span
                    itemProp='name'
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'max-w-[60vw]  font-medium sm:max-w-none',
                      styles.current,
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    itemProp='item'
                    className={cn(
                      'rounded-sm outline-none transition-colors focus-visible:ring-2',
                      styles.link,
                    )}
                  >
                    <span itemProp='name'>{item.label}</span>
                  </Link>
                )}
                <meta itemProp='position' content={String(index + 1)} />
              </li>

              {!isCurrent && (
                <ChevronRight
                  aria-hidden='true'
                  className={cn('size-4 shrink-0', styles.separator)}
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
