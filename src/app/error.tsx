'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Container } from '@/app/components/layout/Container';
import { Button } from '@/app/components/ui/button';

export default function HomeError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div
        role='alert'
        className='flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center'
      >
        <h1 className='text-2xl font-bold text-heading'>Algo salió mal</h1>
        <p className='text-muted'>
          No pudimos cargar la página. Intentá de nuevo.
        </p>
        <Button type='button' size='lg' onClick={() => unstable_retry()}>
          Reintentar
        </Button>
      </div>
    </Container>
  );
}
