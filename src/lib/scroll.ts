import { prefersReducedMotion } from './motion';

export const scrollToAnchor = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({
    block: 'start',
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
};
