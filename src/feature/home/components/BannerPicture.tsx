import { getImageProps } from 'next/image';
import type { BannerSlide } from '@/feature/home/mock/banners';

// La caja fija el alto en cada breakpoint: sin esto el carrusel salta de altura
// al cambiar de slide y la imagen provoca layout shift al terminar de cargar.
const frame =
  'relative block w-full aspect-[1081/1609] md:aspect-[745/1048] lg:aspect-[1921/393]';

type BannerPictureProps = {
  slide: BannerSlide;
  /** Carga inmediata para el banner visible (LCP). El resto va lazy. */
  eager: boolean;
};

function BannerPicture({ slide, eager }: BannerPictureProps) {
  const common = {
    alt: slide.alt,
    sizes: '100vw',
    loading: eager ? ('eager' as const) : ('lazy' as const),
    fetchPriority: eager ? ('high' as const) : ('auto' as const),
  };

  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, ...slide.desktop });

  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, ...slide.tablet });

 
  const { props: img } = getImageProps({ ...common, ...slide.mobile });

  return (
    <picture className={frame}>
      <source media='(min-width: 1024px)' srcSet={desktop} sizes='100vw' />
      <source media='(min-width: 768px)' srcSet={tablet} sizes='100vw' />
      <img
        {...img}
        alt={slide.alt}
        className='absolute inset-0 size-full object-cover'
      />
    </picture>
  );
}

export { BannerPicture };
