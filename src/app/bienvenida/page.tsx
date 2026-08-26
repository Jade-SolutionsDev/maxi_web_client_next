import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/app/components/ui/button';
import verifiedMark from '@/assets/verified-mark.svg';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Bienvenido a Maxi Habana',
  description: 'Tu cuenta ya está creada. Empieza a comprar en Maxi Habana.',
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <section
      aria-labelledby='welcome-title'
      className='flex min-h-[calc(100vh-64px)] items-center justify-center bg-surface px-4 py-12 sm:px-6'
    >
      <div className='w-full max-w-lg text-center'>
        <Image
          src={verifiedMark}
          alt=''
          width={96}
          height={96}
          priority
          className='mx-auto size-20 sm:size-24'
        />

        <h1
          id='welcome-title'
          className='mt-7 text-2xl font-bold text-balance text-heading sm:text-3xl'
        >
          <span aria-hidden='true'>🎉 🎉 </span>¡Felicidades!
        </h1>

        <p className='mx-auto mt-3 max-w-[46ch] text-base text-pretty text-muted'>
          Oficialmente ya tienes creada tu cuenta. Estamos encantados de tenerte
          como nuevo cliente y esperamos que disfrutes de nuestros productos.
        </p>

        <Link
          href='/catalog'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'mt-8 w-full sm:w-auto sm:min-w-56',
          )}
        >
          Empieza por aquí
        </Link>
      </div>
    </section>
  );
}
