'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AwaitingVerificationState,
  LoadingState,
  SuccessState,
  AlreadyVerifiedState,
  ErrorState
} from '@/components/verify-email';
import { useEmailVerification } from '@/lib/hooks/useEmailVerification';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const justRegistered = searchParams.get('registered') === 'true';
  
  const { status, message } = useEmailVerification(token, justRegistered);

  if (status === 'awaiting-verification') return <AwaitingVerificationState />;
  if (status === 'loading') return <LoadingState />;
  if (status === 'success') return <SuccessState />;
  if (status === 'already-verified') return <AlreadyVerifiedState />;
  return <ErrorState message={message} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
