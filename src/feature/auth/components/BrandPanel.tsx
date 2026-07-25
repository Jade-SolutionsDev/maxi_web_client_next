import Image from 'next/image';
import sustento from '@/assets/SUSTENTODELICIOSO.webp';

export type BrandPanelVariant = 'login' | 'register';

type BrandPanelContent = { title: string; description: string };

const CONTENT: Record<BrandPanelVariant, BrandPanelContent> = {
  login: {
    title: 'Bienvenido a Maxi',
    description:
      'Descubre la mejor experiencia de compra en línea con nuestras ofertas exclusivas y envío rápido a toda La Habana.',
  },
  register: {
    title: 'Únete a Maxi',
    description:
      'Creá tu cuenta y accedé a ofertas exclusivas con envío rápido a toda La Habana.',
  },
};

interface BrandPanelProps {
  variant?: BrandPanelVariant;
}

export const BrandPanel = ({ variant = 'login' }: BrandPanelProps) => {
  const { title, description } = CONTENT[variant];

  return (
    <aside className='hidden flex-col justify-center gap-6 bg-surface p-12 lg:flex'>
      <p className='text-4xl font-bold text-primary'>{title}</p>
      <p className='max-w-md text-lg text-muted'>{description}</p>
      {/* El panel está oculto bajo lg, así que se deja lazy: en mobile la
          imagen nunca se muestra y no debe competir por ancho de banda. En
          desktop entra en viewport de entrada y fetchPriority la adelanta. */}
      <Image
        src={sustento}
        alt='Productos Maxi'
        fetchPriority='high'
        className='w-full max-w-lg object-contain'
      />
    </aside>
  );
};
