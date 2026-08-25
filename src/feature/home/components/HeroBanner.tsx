import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { BannerPicture } from '@/feature/home/components/BannerPicture';
import { heroSpineClass } from '@/feature/home/components/hero-banner.styles';
import { getBanners } from '@/shared/cms/service/cms.service';

async function HeroBanner() {
  const banners = await getBanners();

  if (banners.length === 0) return null;

  return (
    <div className={heroSpineClass}>
      <Carousel aria-label='Banners promocionales'>
        <CarouselContent>
          {banners.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <BannerPicture slide={slide} eager={index === 0} />
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
