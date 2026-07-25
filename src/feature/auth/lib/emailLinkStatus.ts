export const EMAIL_LINK_STATUS_PARAM = '__clerk_status';

/** Values Clerk emits, mirroring `EmailLinkErrorCodeStatus` in `@clerk/shared`. */
type ClerkEmailLinkStatus =
  | 'verified'
  | 'expired'
  | 'failed'
  | 'client_mismatch';

/** States the UI renders. */
export type VerifyStatus =
  | 'loading'
  | 'verified'
  | 'expired'
  | 'failed'
  | 'client_mismatch'
  | 'timeout';

const CLERK_STATUS_TO_VERIFY: Record<ClerkEmailLinkStatus, VerifyStatus> = {
  verified: 'verified',
  expired: 'expired',
  failed: 'failed',
  client_mismatch: 'client_mismatch',
};

export const toVerifyStatus = (
  value: string | null | undefined,
): VerifyStatus | null =>
  typeof value === 'string' && value in CLERK_STATUS_TO_VERIFY
    ? CLERK_STATUS_TO_VERIFY[value as ClerkEmailLinkStatus]
    : null;
