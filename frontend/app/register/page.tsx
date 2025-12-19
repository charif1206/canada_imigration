'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/lib/hooks/useAuth';
import { useAuth } from '@/lib/useAuth';
import {
  AuthFormContainer,
  AuthFormHeader,
  RegisterForm,
  AuthFormFooter
} from '@/components/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegister();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/profile');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (data: { name: string; email: string; password: string }) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthFormContainer>
      <AuthFormHeader
        icon="🍁"
        title="Register for Immigration Services"
        subtitle="Start your journey to Canada"
      />
      <RegisterForm onSubmit={handleSubmit} isPending={registerMutation.isPending} />
      <AuthFormFooter
        text="Already registered?"
        linkText="Login here"
        linkHref="/login"
      />
    </AuthFormContainer>
  );
}
