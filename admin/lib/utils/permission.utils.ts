/**
 * Permission Utilities
 * Helper functions for checking user permissions
 */

interface User {
  username: string;
  role: string;
}

/**
 * Check if user has moderator permissions
 */
export function hasModeratorPermission(user: User | null): boolean {
  return user?.role === 'moderator';
}

/**
 * Check if user can access add admin page
 */
export function canAccessAddAdminPage(isAuthenticated: boolean, user: User | null): boolean {
  return isAuthenticated && hasModeratorPermission(user);
}

/**
 * Get loading message based on auth state
 */
export function getLoadingMessage(isAuthenticated: boolean): string {
  return isAuthenticated ? 'Checking permissions...' : 'Verifying authentication...';
}
