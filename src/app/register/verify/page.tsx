'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { VerifyStatusPanel } from '@/feature/auth/components/VerifyStatusPanel';
import { useEmailLinkStatus } from '@/feature/auth/hook/useEmailLinkStatus';

function VerifyEmailStatus() {
  const status = useEmailLinkStatus();
  const router = useRouter();
  const isVerified = status === 'verified';

  useEffect(() => {
    if (isVerified) {
      router.replace('/bienvenida');
    }
  }, [isVerified, router]);

  return <VerifyStatusPanel status={isVerified ? 'loading' : status} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyStatusPanel status='loading' />}>
      <VerifyEmailStatus />
    </Suspense>
  );
}
