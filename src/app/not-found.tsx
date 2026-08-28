import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import { buttonVariants } from '@/app/components/ui/button';
import notFoundIllustration from '@/assets/not-found.svg';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <Container size='sm'>
      <section
        aria-labelledby='not-found-title'
        className='flex min-h-[60vh] flex-col items-center justify-center gap-8 py-16 text-center'
      >
        <Image
          src={notFoundIllustration}
          alt=''
          aria-hidden='true'
          priority
          fetchPriority='high'
          className='h-auto w-64 sm:w-80'
        />

        <div className='flex max-w-md flex-col items-center gap-3'>
          <h1
            id='not-found-title'
            className='font-fredoka text-3xl leading-tight font-bold text-balance text-heading sm:text-4xl'
          >
            Página no encontrada
          </h1>
          <p className='text-balance text-muted'>
            Lo sentimos, la página a la que intentas acceder no existe.
          </p>
        </div>

        <Link
          href='/'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'w-full max-w-xs sm:max-w-sm',
          )}
        >
          Volver al inicio
        </Link>
      </section>
    </Container>
  );
}
