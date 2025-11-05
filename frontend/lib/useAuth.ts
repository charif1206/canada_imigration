'use client';

import { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, Client } from './auth';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  // Use useMemo to compute auth state (no useEffect needed)
  const authState = useMemo(() => {
    const clientId = authUtils.getClientId();
    const clientData = authUtils.getClient();

    if (clientId && clientData) {
      return {
        isAuthenticated: true,
        isLoading: false,
        client: clientData,
      };
    } else {
      // Redirect to login if not on public pages
      const publicPages = ['/login', '/register', '/', '/services', '/contact', '/partners'];
      if (typeof window !== 'undefined' && !publicPages.includes(pathname)) {
        router.push('/login');
      }
      
      return {
        isAuthenticated: false,
        isLoading: false,
        client: null,
      };
    }
  }, [pathname, router]);

  const logout = () => {
    authUtils.clearAuth();
    router.push('/');
  };

  return {
    ...authState,
    logout,
  };
}
