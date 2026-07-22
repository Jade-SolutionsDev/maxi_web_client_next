'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

type EmblaApi = UseEmblaCarouselType[1];

type CarouselContextValue = {
  emblaRef: UseEmblaCarouselType[0];
  api: EmblaApi;
  selectedIndex: number;
  scrollSnaps: number[];
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel parts must be used within a <Carousel />');
  }
  return context;
}

type CarouselProps = React.ComponentProps<'section'> & {
  /** Loop infinito entre slides. Default: true. */
  loop?: boolean;
  /** Milisegundos entre avances automáticos. Default: 5000. */
  autoplayDelay?: number;
};

function Carousel({
  className,
  children,
  loop = true,
  autoplayDelay = 5000,
  ...props
}: CarouselProps) {
  // El plugin se crea una sola vez (identidad estable entre renders).
  const autoplayRef = useRef<ReturnType<typeof Autoplay>>(undefined);
  if (!autoplayRef.current) {
    autoplayRef.current = Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }

  // `duration` = suavidad de la transición slide (unidades de Embla, mayor = más suave).
  const [emblaRef, api] = useEmblaCarousel({ loop, duration: 30 }, [
    autoplayRef.current,
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  // Sincroniza el índice activo y el estado de los controles con Embla.
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    setScrollSnaps(api.scrollSnapList());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      api.plugins().autoplay?.stop();
    }
  }, [api]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  return (
    <CarouselContext.Provider
      value={{
        emblaRef,
        api,
        selectedIndex,
        scrollSnaps,
        canScrollPrev,
        canScrollNext,
        scrollTo,
        scrollPrev,
        scrollNext,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: el patrón de carrusel WAI-ARIA requiere role='region' + aria-roledescription; no hay elemento semántico nativo equivalente. */}
      <section
        data-slot='carousel'
        className={cn('relative', className)}
        role='region'
        aria-roledescription='carousel'
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { emblaRef } = useCarousel();
  return (
    <div
      ref={emblaRef}
      data-slot='carousel-viewport'
      className='overflow-hidden'
    >
      <div
        data-slot='carousel-content'
        className={cn('flex', className)}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: cada slide del carrusel usa role='group' + aria-roledescription='slide' según WAI-ARIA; no hay elemento nativo equivalente.
    <div
      data-slot='carousel-item'
      role='group'
      aria-roledescription='slide'
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type='button'
      data-slot='carousel-previous'
      aria-label='Slide anterior'
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        'absolute top-1/2 left-4 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-primary shadow-md outline-none transition hover:bg-white/80 hover:brightness-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <ChevronLeft className='size-5' aria-hidden='true' />
    </button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<'button'>) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type='button'
      data-slot='carousel-next'
      aria-label='Slide siguiente'
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        'absolute top-1/2 right-4 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-primary shadow-md outline-none transition hover:bg-white/80 hover:brightness-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <ChevronRight className='size-5' aria-hidden='true' />
    </button>
  );
}

function CarouselDots({ className, ...props }: React.ComponentProps<'div'>) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();
  return (
    <div
      data-slot='carousel-dots'
      className={cn(
        'absolute inset-x-0 bottom-4 flex items-center justify-center gap-2',
        className,
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => {
        const isActive = index === selectedIndex;
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: dots map 1:1 to a fixed slide count that never reorders; scroll-snap values can repeat transiently during Embla's loop re-init, so the index is the only stable key.
            key={index}
            type='button'
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={isActive}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-2 rounded-full outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/50',
              isActive ? 'w-6 bg-primary' : 'w-2 bg-white/60 hover:bg-white',
            )}
          />
        );
      })}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};
