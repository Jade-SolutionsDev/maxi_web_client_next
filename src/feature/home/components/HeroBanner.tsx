'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import banner1 from '@/assets/banner1.webp';
import banner2 from '@/assets/banner2.webp';
import banner3 from '@/assets/banner3.webp';

const slides = [
  { src: banner1, alt: 'Promociones Maxi' },
  { src: banner2, alt: 'Ofertas Maxi' },
  { src: banner3, alt: 'Descuentos Maxi' },
];

function HeroBanner() {
  return (
    <Carousel aria-label='Banners promocionales'>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.alt}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className='h-auto w-full object-cover'
            />
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
