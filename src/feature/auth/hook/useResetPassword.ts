'use client';

import { useSignIn as useClerkSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TranslatableClerkError } from '@/feature/auth/lib/clerkErrors';
import type {
  ResetPasswordSchemaType,
  ResetRequestSchemaType,
} from '@/feature/auth/schemas/reset.schema';

export const useResetPassword = () => {
  const { signIn, fetchStatus } = useClerkSignIn();
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<TranslatableClerkError>(null);

  const requestCode = async ({ email }: ResetRequestSchemaType) => {
    const created = await signIn.create({ identifier: email });

    if (created.error) {
      return { error: created.error };
    }

    const sent = await signIn.resetPasswordEmailCode.sendCode();

    if (sent.error) {
      return { error: sent.error };
    }

    setCodeSent(true);

    return { error: null };
  };

  const resendCode = async () => {
    setIsResending(true);
    setResendError(null);
    const sent = await signIn.resetPasswordEmailCode.sendCode();
    setIsResending(false);
    if (sent.error) {
      setResendError(sent.error);
    }
    return sent;
  };

  const resetPassword = async ({
    code,
    password,
  }: Pick<ResetPasswordSchemaType, 'code' | 'password'>) => {
    const verified = await signIn.resetPasswordEmailCode.verifyCode({ code });

    if (verified.error) {
      return { error: verified.error };
    }

    const submitted = await signIn.resetPasswordEmailCode.submitPassword({
      password,
    });

    if (submitted.error) {
      return { error: submitted.error };
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    }

    return { error: null };
  };

  return {
    requestCode,
    resetPassword,
    resendCode,
    isSubmitting: fetchStatus === 'fetching',
    isResending,
    resendError,
    codeSent,
  };
};
