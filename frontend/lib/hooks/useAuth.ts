/**
 * Authentication React Query Hooks
 * 
 * Custom hooks for authentication operations (login, register, logout).
 * These hooks handle JWT storage, Zustand state updates, and navigation.
 * 
 * @see lib/api/clients.api.ts for API functions
 * @see lib/stores/authStore.ts for auth state management
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { loginClient, registerClient } from '../api/clients.api';
import { useAuthStore } from '../stores/authStore';
import type { ClientLoginPayload, ClientRegisterPayload } from '../types/client.types';

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

/**
 * Hook for client login
 * 
 * Automatically stores JWT token, updates Zustand store, and redirects to /status.
 * Shows success/error toast notifications.
 * 
 * @example
 * const LoginForm = () => {
 *   const loginMutation = useLogin();
 * 
 *   const onSubmit = (data: ClientLoginPayload) => {
 *     loginMutation.mutate(data);
 *   };
 * 
 *   return (
 *     <button disabled={loginMutation.isPending}>
 *       {loginMutation.isPending ? 'Logging in...' : 'Login'}
 *     </button>
 *   );
 * };
 */
export const useLogin = () => {
  const router = useRouter();
  const { login: setAuthState } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: ClientLoginPayload) => loginClient(credentials),
    onSuccess: (data) => {
      console.log('✅ Login successful, storing user data in Zustand');
      
      // Update Zustand store (token is auto-persisted by Zustand middleware)
      setAuthState(data.client, data.access_token);
      console.log('✅ Auth state updated and persisted by Zustand');
      
      // Show success toast
      toast.success(`🎉 Welcome back, ${data.client.name}!`);
      
      // Redirect to status page
      console.log('✅ Redirecting to /status');
      router.push('/status');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast.error(`❌ ${errorMessage}`);
      console.error('Login error:', error);
    },
  });
};

/**
 * Hook for client registration
 * 
 * Automatically stores JWT token, updates Zustand store, and redirects to /status.
 * Shows success/error toast notifications.
 * 
 * @example
 * const RegisterForm = () => {
 *   const registerMutation = useRegister();
 * 
 *   const onSubmit = (data: ClientRegisterPayload) => {
 *     registerMutation.mutate(data);
 *   };
 * 
 *   return (
 *     <button disabled={registerMutation.isPending}>
 *       {registerMutation.isPending ? 'Registering...' : 'Register'}
 *     </button>
 *   );
 * };
 */
export const useRegister = () => {
  const router = useRouter();
  const { login: setAuthState } = useAuthStore();

  return useMutation({
    mutationFn: (registerData: ClientRegisterPayload) => registerClient(registerData),
    onSuccess: (data) => {
      console.log('✅ Registration successful, storing user data in Zustand');
      
      // Update Zustand store (token is auto-persisted by Zustand middleware)
      setAuthState(data.client, data.access_token);
      console.log('✅ Auth state updated and persisted by Zustand');
      
      // Show success toast
      toast.success(`🎉 Welcome to Canada Immigration Services, ${data.client.name}!`);
      
      // Redirect to status page
      router.push('/status');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(`❌ ${errorMessage}`);
      console.error('Registration error:', error);
    },
  });
};

/**
 * Hook for client logout
 * 
 * Clears JWT token, resets Zustand store, and redirects to login.
 * Shows success toast notification.
 * 
 * @example
 * const LogoutButton = () => {
 *   const logoutMutation = useLogout();
 * 
 *   return (
 *     <button onClick={() => logoutMutation.mutate()}>
 *       Logout
 *     </button>
 *   );
 * };
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: clearAuthState } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // No backend call needed, just clear local state
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear Zustand auth state (automatically clears persisted storage)
      clearAuthState();
      console.log('✅ Auth state cleared from Zustand and localStorage');
      
      // Clear React Query cache
      queryClient.clear();
      
      // Show success toast
      toast.info('👋 You have been logged out successfully.');
      
      // Redirect to login
      router.push('/login');
    },
  });
};

/**
 * Hook to check authentication status
 * 
 * Returns current auth state from Zustand store.
 * 
 * @example
 * const ProtectedComponent = () => {
 *   const { user, isAuthenticated } = useAuth();
 * 
 *   if (!isAuthenticated) {
 *     return <div>Please login</div>;
 *   }
 * 
 *   return <div>Welcome {user?.name}</div>;
 * };
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
