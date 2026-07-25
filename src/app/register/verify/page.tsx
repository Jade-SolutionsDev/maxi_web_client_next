'use client';

import { Suspense } from 'react';
import { VerifyStatusPanel } from '@/feature/auth/components/VerifyStatusPanel';
import { useEmailLinkStatus } from '@/feature/auth/hook/useEmailLinkStatus';

function VerifyEmailStatus() {
  const status = useEmailLinkStatus();

  return <VerifyStatusPanel status={status} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyStatusPanel status='loading' />}>
      <VerifyEmailStatus />
    </Suspense>
  );
}
