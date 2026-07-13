import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-12', {
  variants: {
    size: {
      sm: 'max-w-3xl', // ~768px — lectura / formularios angostos
      md: 'max-w-5xl', // ~1024px
      lg: 'max-w-7xl', // ~1280px
      xl: 'max-w-[90rem]', // ~1440px — ancho amplio (default)
      full: 'max-w-full', // sin límite, solo el padding horizontal
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className, size }: ContainerProps) => (
  <div className={cn(containerVariants({ size }), className)}>{children}</div>
);
