'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StatusPageContainer, IconCircle, StatusHeading, BackLink } from '@/components/status';
import { ResetPasswordForm } from '@/components/reset-password';
import { usePasswordReset } from '@/lib/hooks/usePasswordReset';

const KeyIcon = () => (
  <svg className="w-full h-full text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const {
    password,
    confirmPassword,
    isSubmitting,
    setPassword,
    setConfirmPassword,
    handleSubmit
  } = usePasswordReset(token);

  return (
    <StatusPageContainer gradientFrom="purple-600" gradientTo="pink-600">
      <IconCircle variant="purple" size="md">
        <KeyIcon />
      </IconCircle>
      
      <StatusHeading
        emoji="🔑"
        title="Reset Your Password"
        subtitle="Enter your new password below"
      />

      <ResetPasswordForm
        password={password}
        confirmPassword={confirmPassword}
        isSubmitting={isSubmitting}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
        onSubmit={handleSubmit}
      />

      <BackLink href="/login" />
    </StatusPageContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
