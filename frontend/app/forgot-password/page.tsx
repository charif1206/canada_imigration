'use client';

import { StatusPageContainer, IconCircle, StatusHeading, BackLink } from '@/components/status';
import { ForgotPasswordForm, SuccessMessage } from '@/components/forgot-password';
import { useForgotPassword } from '@/lib/hooks/useForgotPassword';

const LockIcon = () => (
  <svg className="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function ForgotPasswordPage() {
  const {
    email,
    isSubmitting,
    isSubmitted,
    setEmail,
    handleSubmit,
    resetForm
  } = useForgotPassword();

  if (isSubmitted) {
    return <SuccessMessage email={email} onSendAgain={resetForm} />;
  }

  return (
    <StatusPageContainer gradientFrom="blue-600" gradientTo="blue-900">
      <IconCircle variant="blue" size="md">
        <LockIcon />
      </IconCircle>
      
      <StatusHeading
        emoji="🔐"
        title="Forgot Password?"
        subtitle="No worries! Enter your email and we'll send you a reset link."
      />

      <ForgotPasswordForm
        email={email}
        isSubmitting={isSubmitting}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSubmit={handleSubmit}
      />

      <BackLink href="/login" />
    </StatusPageContainer>
  );
}
