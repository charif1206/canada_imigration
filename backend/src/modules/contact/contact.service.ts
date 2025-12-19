import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ContactMessageResponse } from './interfaces/contact.interface';
import { buildContactEmailContent } from './helpers/email-content.helper';
import { createSuccessResponse } from './helpers/response.helper';
import { formatContactLogMessage } from './helpers/log.helper';

/**
 * Contact Service
 * Handles contact form message submissions and email notifications
 * Follows Single Responsibility Principle with helper functions for specific tasks
 */
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  // ========================================
  // CONTACT MESSAGE HANDLING
  // ========================================

  /**
   * Send contact message to admin via email
   * @param messageDto - Contact message data from user
   * @returns Response indicating success or failure
   */
  async sendContactMessage(
    messageDto: SendMessageDto,
  ): Promise<ContactMessageResponse> {
    this.logger.log(
      formatContactLogMessage('SENDING_MESSAGE', messageDto.senderEmail),
    );

    try {
      // Build email content
      const emailContent = buildContactEmailContent(messageDto);

      // Send email notification
      await this.sendEmailNotification(emailContent);

      // Log success
      this.logger.log(
        formatContactLogMessage('MESSAGE_SENT_SUCCESS', messageDto.senderEmail),
      );

      return createSuccessResponse();
    } catch (error) {
      this.logger.error(
        formatContactLogMessage('MESSAGE_SENT_FAILED', messageDto.senderEmail),
        error,
      );
      throw error;
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Send email notification using NotificationsService
   * @param emailContent - Email content object
   */
  private async sendEmailNotification(emailContent: {
    to: string;
    replyTo: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.notificationsService.sendEmail(emailContent);
  }
}
