/**
 * Contact Module Constants
 * Centralized configuration and messages for contact functionality
 */

/**
 * Admin email configuration
 */
export const CONTACT_CONFIG = {
  ADMIN_EMAIL: 'abedcharif027@gmail.com',
  COMPANY_NAME: 'Canada Immigration Services',
  CURRENT_YEAR: 2025,
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT:
    'Your message has been sent successfully. We will get back to you soon!',
} as const;

/**
 * Log messages
 */
export const LOG_MESSAGES = {
  SENDING_MESSAGE: 'Sending contact message from',
  MESSAGE_SENT_SUCCESS: '✅ Contact message sent successfully from',
  MESSAGE_SENT_FAILED: '❌ Failed to send contact message from',
} as const;

/**
 * Email subject prefix
 */
export const EMAIL_SUBJECT_PREFIX = '[Contact Form]' as const;

/**
 * Email styling constants
 */
export const EMAIL_STYLES = {
  PRIMARY_COLOR: '#667eea',
  SECONDARY_COLOR: '#764ba2',
  WARNING_COLOR: '#ffc107',
  TEXT_COLOR: '#333',
  GRAY_COLOR: '#666',
  BACKGROUND_COLOR: '#f9f9f9',
  WHITE: 'white',
  BORDER_COLOR: '#ddd',
  WARNING_BACKGROUND: '#fff3cd',
} as const;
