/**
 * Form Data Utilities
 * Helper functions for form data processing
 */

import type { RegisterAdminFormData } from '@/src/schemas/auth.schema';

/**
 * Prepare registration data by removing confirmPassword
 */
export function prepareRegistrationData(data: RegisterAdminFormData) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...registerData } = data;
  return registerData;
}
