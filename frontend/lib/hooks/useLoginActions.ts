/**
 * Login Page Actions Hook
 * Encapsulates login form submission logic
 */

'use client';

import { useLogin } from './useAuth';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginActionsReturn {
  handleSubmit: (data: LoginFormData) => void;
  isPending: boolean;
  isError: boolean;
}

/**
 * Hook to manage login page actions
 * @returns Login form handlers and state
 */
export function useLoginActions(): LoginActionsReturn {
  const loginMutation = useLogin();

  const handleSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return {
    handleSubmit,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
  };
}
