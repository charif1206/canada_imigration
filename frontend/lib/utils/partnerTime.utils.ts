/**
 * Partner Time Utilities
 * Helper functions for handling partner resubmission timing
 */

import { PARTNER_RESUBMISSION_CONFIG } from '../constants/partners.constants';

export interface PartnerTimeRemaining {
  canResubmit: boolean;
  hoursLeft: number;
  minutesLeft: number;
}

/**
 * Calculate time remaining before partner resubmission is allowed
 * @param rejectedAt - ISO timestamp of when partner form was rejected
 * @returns Object with resubmission eligibility and time remaining
 */
export function calculatePartnerTimeRemaining(
  rejectedAt: string | null | undefined,
): PartnerTimeRemaining {
  if (!rejectedAt) {
    return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
  }

  const rejectedTime = new Date(rejectedAt).getTime();
  const now = new Date().getTime();
  const elapsed = now - rejectedTime;
  const remaining = PARTNER_RESUBMISSION_CONFIG.WAITING_PERIOD_MS - elapsed;

  if (remaining <= 0) {
    return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
  }

  const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
  const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { canResubmit: false, hoursLeft, minutesLeft };
}

/**
 * Check if user can resubmit partner form based on status and rejection time
 * @param status - Current partner status
 * @param rejectedAt - ISO timestamp of rejection
 * @returns Boolean indicating if resubmission is allowed
 */
export function canResubmitPartnerForm(
  status: string | null | undefined,
  rejectedAt: string | null | undefined,
): boolean {
  if (!status || status === 'form') return true;
  if (status !== 'rejected') return false;
  if (!rejectedAt) return true;
  
  return calculatePartnerTimeRemaining(rejectedAt).canResubmit;
}

/**
 * Determine if partner form should be shown
 * @param status - Current partner status
 * @param rejectedAt - ISO timestamp of rejection
 * @returns Boolean indicating if form should be displayed
 */
export function shouldShowPartnerForm(
  status: string | null | undefined,
  rejectedAt: string | null | undefined,
): boolean {
  if (!status || status === 'form') return true;
  return canResubmitPartnerForm(status, rejectedAt);
}
