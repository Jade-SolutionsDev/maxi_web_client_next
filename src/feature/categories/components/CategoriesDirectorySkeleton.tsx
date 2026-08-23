import { Container } from '@/app/components/layout/Container';
import { Skeleton } from '@/app/components/ui/skeleton';
import { gridClass, railClass } from './categories-directory.styles';

const PILLS = ['a', 'b', 'c', 'd', 'e'];

const BANDS = ['almacen', 'lacteos'];

const CELLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

export function CategoriesDirectorySkeleton() {
  return (
    <Container>
      <div className={railClass} aria-hidden='true'>
        <Skeleton className='h-11 w-full rounded-full' />
        <div className='flex gap-2 overflow-hidden'>
          {PILLS.map((id) => (
            <Skeleton key={id} className='h-11 w-28 shrink-0 rounded-full' />
          ))}
        </div>
      </div>

      {BANDS.map((band) => (
        <section
          key={band}
          aria-hidden='true'
          className='border-t border-input py-8 first:border-t-0 lg:py-10'
        >
          <div className='mb-6 flex items-baseline gap-4'>
            <Skeleton className='h-7 w-40' />
            <Skeleton className='h-4 w-24' />
          </div>

          <ul className={gridClass}>
            {CELLS.map((cell) => (
              <li key={cell} className='flex flex-col items-center gap-3'>
                <Skeleton className='aspect-square w-full max-w-24 rounded-full sm:max-w-32 md:max-w-40 lg:max-w-50' />
                <Skeleton className='h-4 w-2/3' />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
