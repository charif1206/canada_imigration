/**
 * Form Time Utilities
 * Helper functions for handling form resubmission timing
 */

import { RESUBMISSION_CONFIG } from '../constants/forms.constants';

export interface TimeRemaining {
  canResubmit: boolean;
  hoursLeft: number;
  minutesLeft: number;
}

/**
 * Calculate time remaining before form resubmission is allowed
 * @param rejectedAt - ISO timestamp of when form was rejected
 * @returns Object with resubmission eligibility and time remaining
 */
export function calculateTimeRemaining(
  rejectedAt: string | null | undefined,
): TimeRemaining {
  if (!rejectedAt) {
    return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
  }

  const rejectedTime = new Date(rejectedAt).getTime();
  const now = new Date().getTime();
  const elapsed = now - rejectedTime;
  const remaining = RESUBMISSION_CONFIG.WAITING_PERIOD_MS - elapsed;

  if (remaining <= 0) {
    return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
  }

  const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
  const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { canResubmit: false, hoursLeft, minutesLeft };
}

/**
 * Check if user can resubmit based on status and rejection time
 * @param status - Current form status
 * @param rejectedAt - ISO timestamp of rejection
 * @returns Boolean indicating if resubmission is allowed
 */
export function canResubmitForm(
  status: string | null | undefined,
  rejectedAt: string | null | undefined,
): boolean {
  if (status !== 'rejected') return true;
  if (!rejectedAt) return true;
  
  return calculateTimeRemaining(rejectedAt).canResubmit;
}
