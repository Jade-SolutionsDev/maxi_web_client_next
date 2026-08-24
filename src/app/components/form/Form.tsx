'use client';

import type { ReactNode } from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        /**
         * POST is a safety net, not a route: `handleSubmit` calls
         * preventDefault and nothing is ever actually posted. But if the client
         * JavaScript fails to load or hydrate, the browser falls back to a
         * native submit — and the default method is GET, which puts every field
         * in the URL. That is how a password ended up in the server log and in
         * the browser history. With POST, the worst case is a useless request
         * instead of a leaked credential.
         */
        method='post'
        noValidate
        className={cn('flex flex-col gap-4', className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};
