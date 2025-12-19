import { ContactMessageResponse } from '../interfaces/contact.interface';
import { SUCCESS_MESSAGES } from '../constants/contact.constants';

/**
 * Create successful contact message response
 * @returns Contact message response
 */
export function createSuccessResponse(): ContactMessageResponse {
  return {
    success: true,
    message: SUCCESS_MESSAGES.MESSAGE_SENT,
  };
}
