'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils, User } from './auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = authUtils.getToken();
      const userData = authUtils.getUser();

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        
        // Redirect to login if not on login page
        if (pathname !== '/login') {
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
    setUser(null);
    router.push('/login');
  };

  return { isAuthenticated, isLoading, user, logout };
}
