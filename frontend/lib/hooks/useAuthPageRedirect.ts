/**
 * Authentication Page Hook
 * Manages authentication page state including redirect logic
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../useAuth';
import { AUTH_REDIRECT_CONFIG } from '../constants/auth.constants';

export interface AuthPageStateReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook to manage authentication page state
 * Redirects authenticated users to profile page
 * 
 * @returns Authentication page state
 */
export function useAuthPageRedirect(): AuthPageStateReturn {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace(AUTH_REDIRECT_CONFIG.ALREADY_AUTHENTICATED);
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    isLoading,
  };
}
