'use client';

import { useMemo } from 'react';
import { useAuthStore } from './stores/authStore';

export function useAuth() {
  // Get auth state from Zustand (automatically synced with localStorage)
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  // Compute client from user
  const authState = useMemo(() => ({
    isAuthenticated,
    isLoading: false,
    client: user,
  }), [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return {
    ...authState,
    logout: handleLogout,
    refreshAuth: refreshUser,
  };
}
