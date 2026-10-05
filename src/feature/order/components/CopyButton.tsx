'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { notify } from '@/lib/notify';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
  /**
   * Enseña el texto del botón, no solo el icono.
   *
   * El botón nació para copiar datos de pago, donde va pegado al valor que
   * copia y el icono se entiende solo. Para el enlace de seguimiento no vale:
   * Merly pidió «un botón con un nombre intuitivo», y un icono suelto no lo es
   * para quien no lo conoce de antes.
   */
  withText?: boolean;
}

export const CopyButton = ({
  value,
  label,
  className,
  withText = false,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error('No pudimos copiar', {
        description: 'Copia el valor manualmente.',
      });
    }
  };

  return (
    <button
      type='button'
      onClick={handleCopy}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg border border-input text-muted transition-colors hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
        withText ? 'gap-2 px-3 py-2 text-sm font-semibold' : 'p-2',
        className,
      )}
    >
      {copied ? (
        <Check className='size-4 text-total' aria-hidden='true' />
      ) : (
        <Copy className='size-4' aria-hidden='true' />
      )}
      {withText && <span>{copied ? 'Copiado' : label}</span>}
    </button>
  );
};
