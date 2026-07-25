'use client';

import { useSignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  EMAIL_LINK_STATUS_PARAM,
  toVerifyStatus,
  type VerifyStatus,
} from '@/feature/auth/lib/emailLinkStatus';

/** How long to wait for a verdict before telling the user something went wrong. */
const RESOLUTION_TIMEOUT_MS = 12_000;

export const useEmailLinkStatus = (): VerifyStatus => {
  const searchParams = useSearchParams();
  const { signUp } = useSignUp();
  const [timedOut, setTimedOut] = useState(false);

  const resolved =
    toVerifyStatus(searchParams.get(EMAIL_LINK_STATUS_PARAM)) ??
    toVerifyStatus(signUp?.verifications.emailLinkVerification?.status);

  useEffect(() => {
    if (resolved) return;

    const timer = window.setTimeout(
      () => setTimedOut(true),
      RESOLUTION_TIMEOUT_MS,
    );

    return () => window.clearTimeout(timer);
  }, [resolved]);

  if (resolved) return resolved;
  if (timedOut) return 'timeout';

  return 'loading';
};
