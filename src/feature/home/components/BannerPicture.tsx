import { getImageProps } from 'next/image';
import type { BannerSlide } from '@/shared/cms/type/cms.interface';
import { bannerSizes, bannerFrameClass as frame } from './hero-banner.styles';

type BannerPictureProps = {
  slide: BannerSlide;
  /** Carga inmediata para el banner visible (LCP). El resto va lazy. */
  eager: boolean;
};

function BannerPicture({ slide, eager }: BannerPictureProps) {
  const common = {
    alt: slide.alt,
    sizes: bannerSizes,
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
      <source
        media='(min-width: 1024px)'
        srcSet={desktop}
        sizes={bannerSizes}
      />
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
