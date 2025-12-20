'use client';

import {
  AuthFormContainer,
  AuthFormHeader,
  LoginForm,
  AuthFormFooter,
  LoginHelpFooter
} from '@/components/auth';
import { useAuthPageRedirect } from '@/lib/hooks/useAuthPageRedirect';
import { useLoginActions } from '@/lib/hooks/useLoginActions';
import { AUTH_PAGE_CONTENT } from '@/lib/constants/auth.constants';

/**
 * Login Page
 * Handles user authentication with email and password
 */
export default function LoginPage() {
  useAuthPageRedirect();
  const { handleSubmit, isPending } = useLoginActions();
  const content = AUTH_PAGE_CONTENT.LOGIN;

  return (
    <AuthFormContainer>
      <AuthFormHeader
        icon={content.icon}
        title={content.title}
        subtitle={content.subtitle}
      />
      <LoginForm onSubmit={handleSubmit} isPending={isPending} />
      <AuthFormFooter
        text={content.footerText}
        linkText={content.footerLinkText}
        linkHref={content.footerLinkHref}
      />
      <LoginHelpFooter />
    </AuthFormContainer>
  );
}
