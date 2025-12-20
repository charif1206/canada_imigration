/**
 * Permission Check Hook
 * Handles authentication and permission verification
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { canAccessAddAdminPage } from '@/lib/utils/permission.utils';
import { ADD_ADMIN_ROUTES, PERMISSION_CHECK_DELAY } from '@/lib/constants/addAdmin.constants';

interface User {
  username: string;
  role: string;
}

export function usePermissionCheck(isAuthenticated: boolean, user: User | null) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push(ADD_ADMIN_ROUTES.LOGIN);
      } else if (!canAccessAddAdminPage(isAuthenticated, user)) {
        router.push(ADD_ADMIN_ROUTES.DASHBOARD);
      }
    }, PERMISSION_CHECK_DELAY);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return {
    hasAccess: canAccessAddAdminPage(isAuthenticated, user),
  };
}
