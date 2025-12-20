/**
 * Partner State Hook
 * Manages partner form state, including status checking and auto-refresh
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '../useAuth';
import { PARTNER_RESUBMISSION_CONFIG } from '../constants/partners.constants';
import {
  calculatePartnerTimeRemaining,
  canResubmitPartnerForm,
  shouldShowPartnerForm,
} from '../utils/partnerTime.utils';

export interface PartnerStateReturn {
  partnerStatus: string | null | undefined;
  partnerRejectedAt: string | null | undefined;
  partnerRejectionReason: string | null | undefined;
  canResubmit: boolean;
  shouldShowForm: boolean;
  timeRemaining: {
    canResubmit: boolean;
    hoursLeft: number;
    minutesLeft: number;
  };
  isAuthenticated: boolean;
}

/**
 * Hook to manage partner state and auto-refresh
 * @returns Partner state information
 */
export function usePartnerState(): PartnerStateReturn {
  const { client, refreshAuth, isAuthenticated } = useAuth();

  // Auto-refresh every 5 minutes to check for status updates
  useEffect(() => {
    if (!isAuthenticated || !client) return;

    const interval = setInterval(() => {
      refreshAuth();
    }, PARTNER_RESUBMISSION_CONFIG.REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [client, refreshAuth, isAuthenticated]);

  const partnerStatus = client?.partnerStatus;
  const partnerRejectedAt = client?.partnerRejectedAt;
  const partnerRejectionReason = client?.partnerRejectionReason;

  const timeRemaining = calculatePartnerTimeRemaining(partnerRejectedAt);
  const canResubmit = canResubmitPartnerForm(partnerStatus, partnerRejectedAt);
  const shouldShowForm = shouldShowPartnerForm(partnerStatus, partnerRejectedAt);

  return {
    partnerStatus,
    partnerRejectedAt,
    partnerRejectionReason,
    canResubmit,
    shouldShowForm,
    timeRemaining,
    isAuthenticated,
  };
}
