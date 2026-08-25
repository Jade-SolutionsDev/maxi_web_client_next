'use client';

import { useClerk } from '@clerk/nextjs';
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
  /**
   * Not `useSignIn()` from Clerk: in this version its `signIn` is a per-render
   * snapshot whose `status` never leaves `needs_identifier`, so the documented
   * `password()` + `finalize()` flow created the session on Clerk's side and
   * then never activated it — the sign-in appeared to fail while the customer
   * had, in fact, signed in. `client.signIn` is the live resource: `create()`
   * answers with the updated attempt and `setActive()` turns it into a session.
   */
  const clerk = useClerk();
  const router = useRouter();

  /**
   * Not `fetchStatus`: that one goes idle the moment Clerk answers, while
   * activating the session and the navigation are still pending. The button
   * came back to life with the session already created and the page not yet
   * changed.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async ({ email, password }: LoginSchemaType) => {
    setIsSubmitting(true);

    try {
      const attempt = await clerk.client.signIn.create({
        identifier: email,
        password,
      });

      // Clerk can ask for one more step. Without this the hook answered "all
      // good" and the form said nothing at all.
      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        setIsSubmitting(false);
        return { error: SIGN_IN_NOT_COMPLETE };
      }

      await clerk.setActive({ session: attempt.createdSessionId });
      router.push('/');

      // Deliberately not clearing `isSubmitting`: navigation unmounts this
      // form, and clearing it earlier is exactly the dead gap this fixes.
      return { error: null };
    } catch (error) {
      // Clerk throws `ClerkAPIResponseError`, whose `errors` the translator
      // already understands.
      setIsSubmitting(false);
      return { error: error as { errors?: { code?: string | null }[] } };
    }
  };

  return {
    login,
    isSubmitting,
    /**
     * Clerk loads after the form paints. Submitting before it does reaches a
     * `client` that is not there yet, and the customer only sees the generic
     * error: the form keeps the button shut until this turns true.
     */
    isReady: clerk.loaded,
  };
};
