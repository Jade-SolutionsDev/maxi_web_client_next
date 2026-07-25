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
  src: ImageProps['src'] | null | undefined;

  fallbackSrc?: StaticImageData | string;
  ref?: Ref<HTMLImageElement>;
};

const PREVIEW_SIZES = '16px';

export function SafeImage({
  src,
  alt,
  fallbackSrc = fallbackImage,
  className,
  onError,
  onLoad,
  ref,
  fill,
  loading,
  unoptimized,
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

  const showPreview = Boolean(fill) && !unoptimized;

  return (
    <>
      {showPreview && (
        <Image
          src={resolvedSrc}
          alt=''
          aria-hidden
          fill
          sizes={PREVIEW_SIZES}
          loading={loading}
          className={cn(
            className,
            'pointer-events-none scale-105 blur-lg transition-opacity duration-500 motion-reduce:transition-none',
            loaded && 'opacity-0',
          )}
        />
      )}
      <Image
        {...rest}
        ref={setRefs}
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        loading={loading}
        unoptimized={unoptimized}
        className={cn(
         
          !showPreview && [
            'transition-opacity duration-300 motion-reduce:transition-none',
            loaded ? 'opacity-100' : 'opacity-0',
          ],
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
    </>
  );
}
