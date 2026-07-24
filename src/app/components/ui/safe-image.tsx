'use client';

import Image, { type ImageProps, type StaticImageData } from 'next/image';
import {
  type Ref,
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import fallbackImage from '@/assets/fallback.jpeg';
import { cn } from '@/lib/utils';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  /** Source URL; a missing (`null`/`undefined`/empty) value uses `fallbackSrc`. */
  src: ImageProps['src'] | null | undefined;
  /** Shown when `src` is missing or fails to load. Defaults to the shared asset. */
  fallbackSrc?: StaticImageData | string;
  ref?: Ref<HTMLImageElement>;
};

/**
 * next/image wrapper that never leaves a blank hole. It resolves a missing
 * `src` to the fallback, swaps to the fallback if the image fails to load, and
 * fades the image in once ready — so a slow optimizer shows the neutral
 * container background instead of an empty gap. Centralizes the resilience that
 * `src={image ?? fallback}` alone could not provide.
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = fallbackImage,
  className,
  onError,
  onLoad,
  ref,
  ...rest
}: SafeImageProps) {
  const [didError, setDidError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const innerRef = useRef<HTMLImageElement | null>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setDidError(false);
    setLoaded(false);
  }

  useEffect(() => {
    if (innerRef.current?.complete) setLoaded(true);
  }, []);

  const setRefs = useCallback<RefCallback<HTMLImageElement>>(
    (node) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const resolvedSrc = didError || !src ? fallbackSrc : src;

  return (
    <Image
      {...rest}
      ref={setRefs}
      src={resolvedSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300 motion-reduce:transition-none',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        if (!didError) setDidError(true);
        onError?.(event);
      }}
    />
  );
}
