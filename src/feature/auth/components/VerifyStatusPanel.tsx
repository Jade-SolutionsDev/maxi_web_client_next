import Link from 'next/link';
import { buttonVariants } from '@/app/components/ui/button';
import {
  VERIFY_HALO_TONE,
  VERIFY_MEDALLION_TONE,
  VERIFY_STATUS_VIEWS,
} from '@/feature/auth/constants/verify-status.constants';
import type { VerifyStatus } from '@/feature/auth/lib/emailLinkStatus';
import { cn } from '@/lib/utils';

interface VerifyStatusPanelProps {
  status: VerifyStatus;
}

export const VerifyStatusPanel = ({ status }: VerifyStatusPanelProps) => {
  const view = VERIFY_STATUS_VIEWS[status];
  const Icon = view.icon;
  const isPending = status === 'loading';

  return (
    <section
      aria-labelledby='verify-title'
      className='flex min-h-[calc(100vh-64px)] items-center justify-center bg-surface px-4 py-12 sm:px-6'
    >
      <div
        role='status'
        aria-live='polite'
        className='w-full max-w-lg rounded-3xl border border-input bg-background p-8 text-center shadow-[0_1px_2px_rgba(21,35,29,0.04),0_12px_40px_-16px_rgba(21,35,29,0.18)] sm:p-12'
      >
        <span
          key={status}
          className={cn(
            'status-medallion relative mx-auto flex size-20 items-center justify-center rounded-full sm:size-24',
            VERIFY_MEDALLION_TONE[view.tone],
          )}
        >
          {isPending && (
            <span
              aria-hidden='true'
              className={cn(
                'status-halo absolute inset-0 rounded-full',
                VERIFY_HALO_TONE[view.tone],
              )}
            />
          )}

          {Icon ? (
            <Icon aria-hidden='true' className='relative size-9 sm:size-10' />
          ) : (
            <span
              aria-hidden='true'
              className='status-spinner relative size-9 rounded-full border-[3px] border-primary/25 border-t-total sm:size-10'
            />
          )}
        </span>

        <h1
          id='verify-title'
          className='mt-7 text-2xl font-bold text-balance text-heading sm:text-3xl'
        >
          {view.title}
        </h1>

        <p className='mx-auto mt-3 max-w-[46ch] text-base text-pretty text-muted'>
          {view.description}
        </p>

        {view.action && (
          <Link
            href={view.action.href}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-8 w-full sm:w-auto sm:min-w-56',
            )}
          >
            {view.action.label}
          </Link>
        )}

        {view.hint && (
          <p className='mt-6 border-t border-input pt-6 text-sm text-muted'>
            {view.hint}
          </p>
        )}
      </div>
    </section>
  );
};
