'use client';

import { useClerk, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TranslatableClerkError } from '@/feature/auth/lib/clerkErrors';

export const useAceptarInvitacion = () => {
  const { signUp } = useSignUp();
  const { loaded } = useClerk();
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  const aceptar = async (
    ticket: string,
    password: string,
  ): Promise<{ error: TranslatableClerkError }> => {
    setEnviando(true);

    const creada = await signUp.create({
      strategy: 'ticket',
      ticket,
      password,
    });
    if (creada.error) {
      setEnviando(false);
      return { error: creada.error };
    }

    const listo = await signUp.finalize({ navigate: () => router.push('/') });
    if (listo.error) {
      setEnviando(false);
      return { error: listo.error };
    }

    return { error: null };
  };

  return { aceptar, enviando, listo: loaded };
};
