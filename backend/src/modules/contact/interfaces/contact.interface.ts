/**
 * Contact Module Interfaces
 * Defines TypeScript interfaces for contact-related operations
 */

/**
 * Contact message response interface
 */
export interface ContactMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Contact message data for email template
 */
export interface ContactMessageData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  timestamp: Date;
}

/**
 * Email content interface
 */
export interface ContactEmailContent {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}
