/**
 * Dashboard Actions Hook
 * Handles navigation and actions
 */

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/dashboard.constants';

export function useDashboardActions() {
  const router = useRouter();

  const handleViewDetails = (type: 'client' | 'form' | 'partner', id: string) => {
    if (type === 'client') {
      router.push(ROUTES.DETAILS.CLIENT(id));
    } else if (type === 'form') {
      router.push(ROUTES.DETAILS.FORM(id));
    } else if (type === 'partner') {
      router.push(ROUTES.DETAILS.PARTNER(id));
    }
  };

  const navigateToClientDetails = (clientId: string) => {
    router.push(ROUTES.DETAILS.CLIENT(clientId));
  };

  return {
    handleViewDetails,
    navigateToClientDetails,
  };
}
