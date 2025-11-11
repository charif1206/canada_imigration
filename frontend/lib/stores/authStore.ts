// lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  passportNumber?: string | null;
  nationality?: string | null;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Form tracking fields for equivalence form
  isSendingFormulaireEquivalence?: boolean;
  equivalenceStatus?: string | null;
  equivalenceRejectedAt?: string | null;
  equivalenceRejectionReason?: string | null;
  
  // Form tracking fields for residence form
  isSendingFormulaireResidence?: boolean;
  residenceStatus?: string | null;
  residenceRejectedAt?: string | null;
  residenceRejectionReason?: string | null;
  
  // Form tracking fields for partner form
  isSendingPartners?: boolean;
  partnerStatus?: string | null;
  partnerRejectedAt?: string | null;
  partnerRejectionReason?: string | null;
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
  refreshUser: () => Promise<void>;
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

      refreshUser: async () => {
        const state = useAuthStore.getState();
        if (!state.token) return;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/profile`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
            console.log('✅ User data refreshed');
          }
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      },
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
