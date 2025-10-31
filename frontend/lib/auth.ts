export const AUTH_TOKEN_KEY = 'client_token';
export const AUTH_CLIENT_KEY = 'client_data';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  address?: string;
  immigrationType?: string;
  isValidated: boolean;
  createdAt: string;
}

export const authUtils = {
  // Get client ID from localStorage
  getClientId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get client data from localStorage
  getClient: (): Client | null => {
    if (typeof window === 'undefined') return null;
    const client = localStorage.getItem(AUTH_CLIENT_KEY);
    return client ? JSON.parse(client) : null;
  },

  // Set authentication
  setAuth: (clientId: string, client: Client) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_TOKEN_KEY, clientId);
    localStorage.setItem(AUTH_CLIENT_KEY, JSON.stringify(client));
  },

  // Clear authentication
  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CLIENT_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getClientId();
  },
};
