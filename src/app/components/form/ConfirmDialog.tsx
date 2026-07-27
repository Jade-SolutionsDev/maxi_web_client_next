import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

/**
 * Icon badge tone. `default` for neutral confirmations, `warning` for actions
 * the user can lose something with — it borrows the destructive token so the
 * badge and the confirm button read as the same warning.
 */
const confirmIconVariants = cva(
  'flex size-11 items-center justify-center rounded-full [&_svg]:size-5',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-accent',
        warning: 'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type ConfirmDialogVariant = NonNullable<
  VariantProps<typeof confirmIconVariants>['variant']
>;

const confirmButtonVariant = {
  default: 'default',
  warning: 'destructive',
} as const satisfies Record<ConfirmDialogVariant, 'default' | 'destructive'>;

interface ConfirmDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitText?: string;
  cancelText?: string;
  icon: LucideIcon;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  isOpen,
  submitText = 'Confirmar',
  cancelText = 'Cancelar',
  onClose,
  onConfirm,
  icon: Icon,
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  // While the action is running the dialog stays put: dismissing it would hide
  // the pending state of something already in flight.
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!isLoading}
        className='max-w-xs gap-3 sm:max-w-sm'
      >
        <DialogHeader>
          <div className='flex flex-col items-center gap-2 text-center'>
            <span className={cn(confirmIconVariants({ variant }))}>
              <Icon aria-hidden='true' />
            </span>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className='text-balance'>
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Side by side from the smallest screen: two short actions read faster
            than a stack, and it keeps the sheet from feeling like a full page. */}
        <DialogFooter className='flex-row justify-end border-heading/10 bg-transparent p-3'>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='flex-1 sm:flex-none'
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {cancelText}
          </Button>

          <Button
            type='button'
            size='sm'
            variant={confirmButtonVariant[variant]}
            className='flex-1 sm:flex-none'
            loading={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
