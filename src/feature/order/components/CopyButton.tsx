'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

export const CopyButton = ({ value, label, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error('No pudimos copiar', {
        description: 'Copiá el valor manualmente.',
      });
    }
  };

  return (
    <button
      type='button'
      onClick={handleCopy}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg border border-input p-2 text-muted transition-colors hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
        className,
      )}
    >
      {copied ? (
        <Check className='size-4 text-total' aria-hidden='true' />
      ) : (
        <Copy className='size-4' aria-hidden='true' />
      )}
    </button>
  );
};
