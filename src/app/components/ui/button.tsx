import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-xl outline-none transition hover:brightness-90 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:brightness-100 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white',
        secondary: 'bg-secondary text-white',
        outline:
          'border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/5',
        ghost: 'bg-transparent text-foreground hover:bg-foreground/5',
      },
      size: {
        default: 'px-4 py-3 text-lg font-medium',
        lg: 'p-4 text-base font-bold',
        'icon-sm': 'size-8 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot='button'
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          className='mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent'
          aria-hidden='true'
        />
      )}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
