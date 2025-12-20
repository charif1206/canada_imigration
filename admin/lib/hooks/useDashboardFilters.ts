/**
 * Dashboard Filters Hook
 * Manages client filtering logic
 */

import {
  useAllClients,
  usePendingClients,
  useValidatedClients,
} from '@/src/hooks/useClients';
import {
  filterPendingPartnerClients,
  filterPendingResidenceClients,
  filterPendingEquivalenceClients,
} from '@/lib/utils/clientFilter.utils';
import { createVerificationEntries } from '@/lib/utils/verification.utils';

export function useDashboardFilters(currentPage: number) {
  const { data: allClientsData, isLoading: loadingAll } = useAllClients(currentPage);
  const {
    data: pendingClients,
    isLoading: loadingPending,
    refetch: refetchPending,
  } = usePendingClients();
  const { data: validatedClients, isLoading: loadingValidated } = useValidatedClients();

  // Filter clients by form type
  const pendingPartnerClients = filterPendingPartnerClients(pendingClients);
  const pendingResidenceClients = filterPendingResidenceClients(pendingClients);
  const pendingEquivalenceClients = filterPendingEquivalenceClients(pendingClients);

  // Create verification entries
  const verificationEntries = createVerificationEntries(validatedClients);

  // Calculate stats
  const stats = {
    totalClients: allClientsData?.pagination.total || 0,
    pendingPartner: pendingPartnerClients.length,
    pendingResidence: pendingResidenceClients.length,
    pendingEquivalence: pendingEquivalenceClients.length,
    validatedClients: validatedClients?.length || 0,
  };

  return {
    allClientsData,
    pendingPartnerClients,
    pendingResidenceClients,
    pendingEquivalenceClients,
    verificationEntries,
    stats,
    loadingAll,
    loadingPending,
    loadingValidated,
    refetchPending,
  };
}
