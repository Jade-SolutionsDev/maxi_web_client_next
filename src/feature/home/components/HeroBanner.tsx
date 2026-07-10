import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { BannerPicture } from '@/feature/home/components/BannerPicture';
import { banners } from '@/feature/home/mock/banners';

function HeroBanner() {
  return (
    <Carousel aria-label='Banners promocionales'>
      <CarouselContent>
        {banners.map((slide, index) => (
          <CarouselItem key={slide.alt}>
            <BannerPicture slide={slide} eager={index === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}

export { HeroBanner };
