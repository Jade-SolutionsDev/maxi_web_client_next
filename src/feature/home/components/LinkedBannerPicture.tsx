import Link from 'next/link';
import type { BannerSlide } from '@/shared/cms/type/cms.interface';
import { bannerTargetHref } from '../constants/banner-target-href';
import { BannerPicture } from './BannerPicture';

type LinkedBannerPictureProps = {
  slide: BannerSlide;
  eager: boolean;
};

/** A banner without a public destination intentionally remains a plain image. */
function LinkedBannerPicture({ slide, eager }: LinkedBannerPictureProps) {
  const href = bannerTargetHref(slide.target);
  const picture = <BannerPicture slide={slide} eager={eager} />;

  if (!href) return picture;

  return (
    <Link
      href={href}
      className='block rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:ring-inset'
    >
      {picture}
    </Link>
  );
}

export { LinkedBannerPicture };
