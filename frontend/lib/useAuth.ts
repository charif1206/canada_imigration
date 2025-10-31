'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, Client } from './auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const clientId = authUtils.getClientId();
      const clientData = authUtils.getClient();

      if (clientId && clientData) {
        setIsAuthenticated(true);
        setClient(clientData);
      } else {
        setIsAuthenticated(false);
        setClient(null);
        
        // Redirect to login if not on public pages
        const publicPages = ['/login', '/register', '/', '/services', '/contact', '/partners'];
        if (!publicPages.includes(pathname)) {
          router.push('/login');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const logout = () => {
    authUtils.clearAuth();
    setIsAuthenticated(false);
    setClient(null);
    router.push('/');
  };

  return {
    isAuthenticated,
    isLoading,
    client,
    logout,
  };
}
