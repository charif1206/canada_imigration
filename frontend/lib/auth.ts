/**
 * @deprecated This file is deprecated. Use Zustand store directly via `useAuthStore` instead.
 * 
 * Legacy auth utilities - kept for backward compatibility.
 * All functionality now handled by Zustand store with persist middleware.
 * Storage key changed from 'client_token' to 'auth-storage' (Zustand persist).
 */

import { useAuthStore } from './stores/authStore';

// Legacy keys - no longer used directly
export const AUTH_TOKEN_KEY = 'client_token'; // DEPRECATED: Use 'auth-storage' (Zustand persist)
export const AUTH_CLIENT_KEY = 'client_data'; // DEPRECATED: Not used

export interface Client {
  id: string;
  name: string;
  email: string;
  passportNumber?: string;
  nationality?: string;
  isValidated: boolean;
  validatedAt?: string;
  validatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper to read token from Zustand persisted storage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  
  return null;
};

// Helper to read user from Zustand persisted storage
const getAuthUser = (): Client | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.user || null;
    }
  } catch (error) {
    console.error('Error reading auth user:', error);
  }
  
  return null;
};

/**
 * @deprecated Use Zustand store directly: `useAuthStore.getState().token`
 */
export const authUtils = {
  // Get token from Zustand storage
  getClientId: (): string | null => {
    return getAuthToken();
  },

  // Get client data from Zustand storage
  getClient: (): Client | null => {
    return getAuthUser();
  },

  // Set authentication - delegates to Zustand
  setAuth: (clientId: string, client: Client) => {
    useAuthStore.getState().login(client, clientId);
  },

  // Clear authentication - delegates to Zustand
  clearAuth: () => {
    useAuthStore.getState().logout();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};
