import { SendMessageDto } from '../dto/send-message.dto';
import {
  ContactEmailContent,
  ContactMessageData,
} from '../interfaces/contact.interface';
import {
  CONTACT_CONFIG,
  EMAIL_SUBJECT_PREFIX,
} from '../constants/contact.constants';
import { generateContactEmailTemplate } from './email-template.helper';

/**
 * Create contact message data object
 * @param messageDto - Send message DTO
 * @returns Contact message data
 */
export function createContactMessageData(
  messageDto: SendMessageDto,
): ContactMessageData {
  return {
    senderName: messageDto.senderName,
    senderEmail: messageDto.senderEmail,
    subject: messageDto.subject,
    message: messageDto.message,
    timestamp: new Date(),
  };
}

/**
 * Build email content for contact message
 * @param messageDto - Send message DTO
 * @returns Email content object
 */
export function buildContactEmailContent(
  messageDto: SendMessageDto,
): ContactEmailContent {
  const messageData = createContactMessageData(messageDto);
  const htmlContent = generateContactEmailTemplate(messageData);

  return {
    to: CONTACT_CONFIG.ADMIN_EMAIL,
    replyTo: messageDto.senderEmail,
    subject: `${EMAIL_SUBJECT_PREFIX} ${messageDto.subject}`,
    html: htmlContent,
  };
}
