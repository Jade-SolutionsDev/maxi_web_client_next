'use client';

import { useSignUp as useClerkSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TranslatableClerkError } from '@/feature/auth/lib/clerkErrors';
import type { RegisterSchemaType } from '@/feature/auth/schemas/register.schema';

export const useSignUp = () => {
  const { signUp, fetchStatus } = useClerkSignUp();
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<TranslatableClerkError>(null);

  const resendEmail = async () => {
    setIsResending(true);
    setResendError(null);
    const sent = await signUp.verifications.sendEmailLink({
      verificationUrl: `${window.location.origin}/register/verify`,
    });
    setIsResending(false);
    if (sent.error) {
      setResendError(sent.error);
    }
    return sent;
  };

  const register = async ({ name, email, password }: RegisterSchemaType) => {
    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ');

    const created = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (created.error) {
      return { error: created.error };
    }

    const sent = await signUp.verifications.sendEmailLink({
      verificationUrl: `${window.location.origin}/register/verify`,
    });

    if (sent.error) {
      return { error: sent.error };
    }

    setEmailSent(true);

    const verified = await signUp.verifications.waitForEmailLinkVerification();

    if (verified.error) {
      return { error: verified.error };
    }

    if (signUp.status === 'complete') {
      await signUp.finalize({
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
    register,
    resendEmail,
    isSubmitting: fetchStatus === 'fetching',
    isResending,
    resendError,
    emailSent,
  };
};
