'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn, isActiveHref } from '@/lib/utils';
import { navItems } from './constants/nav.constants';
import { navItemClass, primaryNavClass } from './nav-item.styles';

type Indicator = { x: number; width: number; visible: boolean };

export const PrimaryNav = () => {
  const pathname = usePathname();
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState<Indicator>({
    x: 0,
    width: 0,
    visible: false,
  });
  const [animate, setAnimate] = useState(false);

  const activeIndex = navItems.findIndex(({ href }) =>
    isActiveHref(href, pathname),
  );

  const moveTo = useCallback((index: number) => {
    const el = linkRefs.current[index];
    if (!el) return;
    setIndicator({ x: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, []);

  const settle = useCallback(() => {
    if (activeIndex < 0) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }
    moveTo(activeIndex);
  }, [activeIndex, moveTo]);


  useEffect(() => {
    settle();
    const raf = requestAnimationFrame(() => setAnimate(true));
    window.addEventListener('resize', settle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', settle);
    };
  }, [settle]);

  return (
    <nav
      aria-label='Navegación principal'
      onPointerLeave={settle}
      className={primaryNavClass}
    >
      {navItems.map(({ href, label }, index) => (
        <Link
          key={href}
          ref={(el) => {
            linkRefs.current[index] = el;
          }}
          href={href}
          aria-current={index === activeIndex ? 'page' : undefined}
          onPointerEnter={() => moveTo(index)}
          className={navItemClass(index === activeIndex)}
        >
          {label}
        </Link>
      ))}

      <span
        aria-hidden='true'
        style={{
          width: 1,
          transform: `translateX(${indicator.x}px) scaleX(${indicator.width})`,
          opacity: indicator.visible ? 1 : 0,
        }}
        className={cn(
          'pointer-events-none absolute bottom-1 left-0 h-1 origin-left rounded-full bg-white',
          animate &&
            'transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
        )}
      />
    </nav>
  );
};
