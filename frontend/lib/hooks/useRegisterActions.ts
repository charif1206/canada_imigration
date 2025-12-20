/**
 * Register Page Actions Hook
 * Encapsulates registration form submission logic
 */

'use client';

import { useRegister } from './useAuth';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterActionsReturn {
  handleSubmit: (data: RegisterFormData) => void;
  isPending: boolean;
  isError: boolean;
}

/**
 * Hook to manage register page actions
 * @returns Register form handlers and state
 */
export function useRegisterActions(): RegisterActionsReturn {
  const registerMutation = useRegister();

  const handleSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return {
    handleSubmit,
    isPending: registerMutation.isPending,
    isError: registerMutation.isError,
  };
}
