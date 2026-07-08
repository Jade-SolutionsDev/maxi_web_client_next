import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shell horizontal compartido por Header y Footer (y páginas si lo adoptan).
 * Mobile y tablet llenan el 100%; en desktop el contenido se centra con
 * `max-w-7xl` (1280px) para que no quede estirado. Mantener los bordes de
 * header/footer alineados depende de reutilizar SIEMPRE este contenedor.
 */
export const Container = ({ children, className }: ContainerProps) => (
  <div
    className={cn('mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-12', className)}
  >
    {children}
  </div>
);
