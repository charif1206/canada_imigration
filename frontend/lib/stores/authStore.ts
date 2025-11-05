// lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  isValidated: boolean;
  immigrationType?: string;
  createdAt: string;
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

      setToken: (token) => {
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('client_token', token);
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('client_token');
        }
        set({ token });
      },

      login: (user, token) => {
        console.log('🔐 AuthStore.login() called with:', { user: user?.name, hasToken: !!token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('client_token', token);
          console.log('🔐 Token saved to localStorage in authStore');
        }
        set({
          user,
          token,
          isAuthenticated: true,
        });
        console.log('🔐 Zustand state updated');
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('client_token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
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
