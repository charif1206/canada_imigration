/**
 * Auth Store using Zustand
 * Global state for authentication
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      
      setAuth: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true });
        // Also save to the old storage keys for axios interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
        }
      },
      
      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false });
        // Also clear the old storage keys
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Sync token to old storage key for axios interceptor
        if (state && typeof window !== 'undefined') {
          if (state.token && state.user) {
            localStorage.setItem('admin_token', state.token);
            localStorage.setItem('admin_user', JSON.stringify(state.user));
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);
