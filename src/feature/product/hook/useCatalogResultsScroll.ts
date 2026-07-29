'use client';

import { useCallback, useEffect, useRef } from 'react';
import { scrollToAnchor } from '@/lib/scroll';
import { CATALOG_RESULTS_ID } from '../constants/catalog-anchor';

const MAX_UNLOCK_FRAMES = 40;

const isPageScrollLocked = () =>
  getComputedStyle(document.body).overflow === 'hidden';

export const useCatalogResultsScroll = () => {
  const isSuspended = useRef(false);
  const isPending = useRef(false);
  const frame = useRef<number | null>(null);

  const scroll = useCallback((framesLeft = MAX_UNLOCK_FRAMES) => {
    frame.current = requestAnimationFrame(() => {
      if (framesLeft > 0 && isPageScrollLocked()) {
        scroll(framesLeft - 1);
        return;
      }
      scrollToAnchor(CATALOG_RESULTS_ID);
    });
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const requestScroll = useCallback(() => {
    if (isSuspended.current) {
      isPending.current = true;
      return;
    }
    scroll();
  }, [scroll]);

  const setScrollSuspended = useCallback(
    (suspended: boolean) => {
      isSuspended.current = suspended;
      if (suspended || !isPending.current) return;

      isPending.current = false;
      scroll();
    },
    [scroll],
  );

  return { requestScroll, setScrollSuspended };
};
