'use client';

import {
  AuthFormContainer,
  AuthFormHeader,
  RegisterForm,
  AuthFormFooter
} from '@/components/auth';
import { useAuthPageRedirect } from '@/lib/hooks/useAuthPageRedirect';
import { useRegisterActions } from '@/lib/hooks/useRegisterActions';
import { AUTH_PAGE_CONTENT } from '@/lib/constants/auth.constants';

/**
 * Register Page
 * Handles new user registration
 */
export default function RegisterPage() {
  useAuthPageRedirect();
  const { handleSubmit, isPending } = useRegisterActions();
  const content = AUTH_PAGE_CONTENT.REGISTER;

  return (
    <AuthFormContainer>
      <AuthFormHeader
        icon={content.icon}
        title={content.title}
        subtitle={content.subtitle}
      />
      <RegisterForm onSubmit={handleSubmit} isPending={isPending} />
      <AuthFormFooter
        text={content.footerText}
        linkText={content.footerLinkText}
        linkHref={content.footerLinkHref}
      />
    </AuthFormContainer>
  );
}
