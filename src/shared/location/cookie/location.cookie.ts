import 'server-only';

import { cookies } from 'next/headers';

const LOCATION_COOKIE = 'maxi_location';

const LOCATION_MAX_AGE = 60 * 60 * 24 * 30;

export const readMunicipalityId = async (): Promise<string | null> => {
  const cookieStore = await cookies();

  return cookieStore.get(LOCATION_COOKIE)?.value ?? null;
};

export const writeMunicipalityId = async (
  municipalityId: string,
): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(LOCATION_COOKIE, municipalityId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: LOCATION_MAX_AGE,
  });
};
