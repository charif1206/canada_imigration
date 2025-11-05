// lib/stores/validationStore.ts
// TODO: Implement validation store when backend validation API is ready
// This file is currently commented out and not in use

/*
import { create } from 'zustand';

interface ValidationStatus {
  clientId: string;
  status: 'pending' | 'approved' | 'rejected';
  isValidated: boolean;
  validatedAt: string | null;
  validatedBy: string | null;
  notes?: string;
}

interface ValidationState {
  validationStatus: ValidationStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setValidationStatus: (status: ValidationStatus | null) => void;
  updateValidationStatus: (updates: Partial<ValidationStatus>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useValidationStore = create<ValidationState>((set) => ({
  validationStatus: null,
  isLoading: false,
  error: null,

  setValidationStatus: (status) =>
    set({
      validationStatus: status,
      error: null,
    }),

  updateValidationStatus: (updates) =>
    set((state) => ({
      validationStatus: state.validationStatus
        ? { ...state.validationStatus, ...updates }
        : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
*/

// Temporary placeholder export to prevent import errors
import { create } from 'zustand';

interface ValidationStatus {
  clientId: string;
  status: 'pending' | 'approved' | 'rejected';
  isValidated: boolean;
  validatedAt: string | null;
  validatedBy: string | null;
  notes?: string;
}

interface ValidationState {
  validationStatus: ValidationStatus | null;
  isLoading: boolean;
  error: string | null;
  setValidationStatus: (status: ValidationStatus | null) => void;
  updateValidationStatus: (updates: Partial<ValidationStatus>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Placeholder store with no functionality (for now)
export const useValidationStore = create<ValidationState>(() => ({
  validationStatus: null,
  isLoading: false,
  error: null,
  setValidationStatus: () => {},
  updateValidationStatus: () => {},
  setLoading: () => {},
  setError: () => {},
  clearError: () => {},
}));
