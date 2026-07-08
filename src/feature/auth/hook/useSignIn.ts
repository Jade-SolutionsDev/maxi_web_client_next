'use client';

import { useSignIn as useClerkSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { LoginSchemaType } from '@/feature/auth/schemas/login.schema';

export const useSignIn = () => {
  const { signIn, errors, fetchStatus } = useClerkSignIn();
  const router = useRouter();

  const login = async ({ email, password }: LoginSchemaType) => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      return { error };
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
    login,
    errors,
    isSubmitting: fetchStatus === 'fetching',
  };
};
