export const AUTH_TOKEN_KEY = 'admin_token';
export const AUTH_USER_KEY = 'admin_user';

export interface User {
  id: string;
  username: string;
  email: string | null;
  role: string;
}

export const authUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get user from localStorage
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Set authentication
  setAuth: (token: string, user: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  // Clear authentication
  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Get authorization header
  getAuthHeader: (): Record<string, string> => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
