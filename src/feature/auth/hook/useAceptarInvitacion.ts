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

    const canjeado = await signUp.ticket({ ticket });
    if (canjeado.error) {
      setEnviando(false);
      return { error: canjeado.error };
    }

    const correo = signUp.emailAddress;
    if (!correo) {
      setEnviando(false);
      return { error: { code: 'invitation_without_email' } };
    }

    const conClave = await signUp.password({ emailAddress: correo, password });
    if (conClave.error) {
      setEnviando(false);
      return { error: conClave.error };
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
