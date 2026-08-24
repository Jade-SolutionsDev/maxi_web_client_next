'use client';

import { useSignIn as useClerkSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { LoginSchemaType } from '@/feature/auth/schemas/login.schema';

/**
 * Synthetic error for an attempt Clerk did not leave in `complete` — a second
 * factor, a pending verification. It travels through the same translation
 * pipeline as a real Clerk error.
 */
const SIGN_IN_NOT_COMPLETE = { code: 'sign_in_not_complete' } as const;

export const useSignIn = () => {
  const { signIn } = useClerkSignIn();
  const router = useRouter();

  /**
   * Not `fetchStatus`: that one goes idle the moment Clerk answers, while
   * `finalize()` and the navigation are still pending. The button came back to
   * life with the session already created and the page not yet changed.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async ({ email, password }: LoginSchemaType) => {
    setIsSubmitting(true);

    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      setIsSubmitting(false);
      return { error };
    }

    // Clerk can ask for one more step. Without this the hook answered "all
    // good" and the form said nothing at all — and, now that the button stays
    // busy until navigation, it would have spun forever.
    if (signIn.status !== 'complete') {
      setIsSubmitting(false);
      return { error: SIGN_IN_NOT_COMPLETE };
    }

    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        // A pending task means we are staying on this page: release the button.
        if (session?.currentTask) {
          setIsSubmitting(false);
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

    // Deliberately not clearing `isSubmitting`: navigation unmounts this form,
    // and clearing it earlier is exactly the dead gap this fixes.
    return { error: null };
  };

  return {
    login,
    isSubmitting,
  };
};
