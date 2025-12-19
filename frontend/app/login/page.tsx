'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/lib/hooks/useAuth';
import { useAuth } from '@/lib/useAuth';
import {
  AuthFormContainer,
  AuthFormHeader,
  LoginForm,
  AuthFormFooter,
  LoginHelpFooter
} from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/profile');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthFormContainer>
      <AuthFormHeader
        icon="🍁"
        title="Client Login"
        subtitle="Access your immigration application status"
      />
      <LoginForm onSubmit={handleSubmit} isPending={loginMutation.isPending} />
      <AuthFormFooter
        text="Don't have an account?"
        linkText="Register here"
        linkHref="/register"
      />
      <LoginHelpFooter />
    </AuthFormContainer>
  );
}
