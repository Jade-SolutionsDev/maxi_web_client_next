import Link from 'next/link';
import { Container } from '@/app/components/layout/Container';
import { buttonVariants } from '@/app/components/ui/button';

export default function ProductNotFound() {
  return (
    <Container>
      <div
        role='alert'
        className='flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center'
      >
        <h1 className='text-2xl font-bold text-heading'>
          Producto no encontrado
        </h1>
        <p className='text-muted'>
          El producto que buscás no existe o ya no está disponible.
        </p>
        <Link href='/catalog' className={buttonVariants({ size: 'lg' })}>
          Volver al catálogo
        </Link>
      </div>
    </Container>
  );
}
