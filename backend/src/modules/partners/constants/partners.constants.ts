/**
 * Partners module configuration constants
 */

// Partner application type
export const PARTNER_TYPE = 'PARTNER' as const;

// Partner status
export const PARTNER_STATUS = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
};

// Success messages
export const SUCCESS_MESSAGES = {
  PARTNER_SUBMITTED: 'Partner application submitted successfully. We will contact you within 24 hours.',
};

// Log messages
export const LOG_MESSAGES = {
  APPLICATION_SUBMITTED: '📝 Partner application submitted for: {agencyName}',
  APPLICATION_PERSISTED: '✅ Partner application persisted (id={id})',
  CLIENT_UPDATED: '✅ Client {clientId} marked as sending partner application',
  DATABASE_SAVE_FAILED: '⚠️ Could not save to database, continuing with notifications',
  FETCH_PARTNERS_FAILED: '❌ Failed to fetch partners',
  FETCH_PARTNER_FAILED: '❌ Failed to fetch partner {id}',
};
