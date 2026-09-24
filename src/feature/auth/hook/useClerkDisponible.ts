'use client';

import { useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const ESPERA_ANTES_DE_DARLO_POR_CAIDO_MS = 8_000;

export const useClerkDisponible = () => {
  const { loaded } = useClerk();
  const [seAgotoLaEspera, setSeAgotoLaEspera] = useState(false);

  useEffect(() => {
    if (loaded) return;

    const temporizador = setTimeout(
      () => setSeAgotoLaEspera(true),
      ESPERA_ANTES_DE_DARLO_POR_CAIDO_MS,
    );

    return () => clearTimeout(temporizador);
  }, [loaded]);

  return { listo: loaded, caido: !loaded && seAgotoLaEspera };
};
