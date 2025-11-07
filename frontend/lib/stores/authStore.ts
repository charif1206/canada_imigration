// lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  passportNumber?: string | null;
  nationality?: string | null;
  isValidated: boolean;
  validatedAt?: string | null;
  validatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) =>
        set({ token, isAuthenticated: !!token }),

      login: (user, token) => {
        console.log('🔐 AuthStore.login() - Saving to Zustand (auto-persisted):', { user: user?.name, hasToken: !!token });
        set({
          user,
          token,
          isAuthenticated: true,
        });
        console.log('✅ Zustand state updated and auto-persisted to localStorage');
      },

      logout: () => {
        console.log('🔐 AuthStore.logout() - Clearing Zustand state');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        console.log('✅ Zustand state cleared (localStorage auto-updated)');
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
