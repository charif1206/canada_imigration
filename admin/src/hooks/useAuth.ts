/**
 * Auth Hooks using React Query
 * Handles authentication mutations with toast notifications
 */

import { useMutation } from '@tanstack/react-query';
import { loginAdmin, registerAdmin } from '@/src/api/auth.api';
import { useAuthStore } from '@/src/stores/auth.store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Hook for admin login
 */
export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      // Set auth state first
      setAuth(data.access_token, data.admin);
      // Show success message
      toast.success(`Welcome back, ${data.admin.username}!`);
      // Navigate to dashboard
      router.push('/');
    },
    onError: (error: ErrorResponse) => {
      const message = error.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
    // Prevent duplicate requests
    retry: false,
  });
};

/**
 * Hook for registering new admin
 */
export const useRegisterAdmin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerAdmin,
    onSuccess: (data) => {
      toast.success(`Admin account created successfully for ${data.username}!`);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    },
    onError: (error: ErrorResponse) => {
      const message = error.response?.data?.message || 'Failed to create admin account';
      toast.error(message);
    },
  });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };
};
