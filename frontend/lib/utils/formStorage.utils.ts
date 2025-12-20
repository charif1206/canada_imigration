/**
 * Form Storage Utilities
 * Helper functions for managing form state in localStorage
 */

import { STORAGE_KEYS, FormType } from '../constants/forms.constants';

/**
 * Generate storage key for temporary sending state
 */
function getTempSendingKey(formType: FormType, clientId: string): string {
  return `${STORAGE_KEYS.TEMP_SENDING_PREFIX}${formType}_${clientId}`;
}

/**
 * Set temporary sending state in localStorage
 */
export function setTempSendingState(
  formType: FormType,
  clientId: string,
  value: boolean,
): void {
  if (typeof window === 'undefined') return;
  
  const key = getTempSendingKey(formType, clientId);
  localStorage.setItem(key, value.toString());
}

/**
 * Get temporary sending state from localStorage
 */
export function getTempSendingState(
  formType: FormType,
  clientId: string | undefined,
): boolean {
  if (typeof window === 'undefined' || !clientId) return false;
  
  const key = getTempSendingKey(formType, clientId);
  return localStorage.getItem(key) === 'true';
}

/**
 * Remove temporary sending state from localStorage
 */
export function removeTempSendingState(
  formType: FormType,
  clientId: string,
): void {
  if (typeof window === 'undefined') return;
  
  const key = getTempSendingKey(formType, clientId);
  localStorage.removeItem(key);
}

/**
 * Clean up old temporary sending states for other clients
 */
export function cleanupOldTempStates(
  formType: FormType,
  currentClientId: string,
): void {
  if (typeof window === 'undefined') return;
  
  const allKeys = Object.keys(localStorage);
  const prefix = `${STORAGE_KEYS.TEMP_SENDING_PREFIX}${formType}_`;
  
  allKeys.forEach((key) => {
    if (key.startsWith(prefix) && !key.includes(currentClientId)) {
      localStorage.removeItem(key);
    }
  });
}
