import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'w-full min-w-0 rounded-xl border-[1.5px] border-input bg-transparent px-4 py-3.5 text-[14.5px] leading-[1.2] text-heading transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
