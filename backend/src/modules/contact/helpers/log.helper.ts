import { LOG_MESSAGES } from '../constants/contact.constants';

/**
 * Format log message for contact operations
 * @param messageType - Type of log message
 * @param email - Email address
 * @returns Formatted log message
 */
export function formatContactLogMessage(
  messageType: keyof typeof LOG_MESSAGES,
  email: string,
): string {
  return `${LOG_MESSAGES[messageType]} ${email}`;
}
