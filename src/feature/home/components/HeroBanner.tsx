import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { heroSpineClass } from '@/feature/home/components/hero-banner.styles';
import { LinkedBannerPicture } from '@/feature/home/components/LinkedBannerPicture';
import type { BannerSlide } from '@/shared/cms/type/cms.interface';

type HeroBannerProps = {
  banners: BannerSlide[];
};

function HeroBanner({ banners }: HeroBannerProps) {
  if (banners.length === 0) return null;

  return (
    <div className={heroSpineClass}>
      <Carousel aria-label='Banners promocionales'>
        <CarouselContent>
          {banners.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <LinkedBannerPicture slide={slide} eager={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  );
}

export { HeroBanner };
