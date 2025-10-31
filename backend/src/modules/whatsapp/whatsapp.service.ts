import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;
  private readonly adminNumber: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('WHATSAPP_ACCOUNT_SID');
    this.authToken = this.configService.get<string>('WHATSAPP_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('WHATSAPP_FROM_NUMBER');
    this.adminNumber = this.configService.get<string>('WHATSAPP_ADMIN_NUMBER');
    this.apiUrl = `${this.configService.get<string>('WHATSAPP_API_URL')}/${this.accountSid}/Messages.json`;
  }

  async sendMessageToAdmin(message: string): Promise<void> {
    try {
      if (!this.accountSid || !this.authToken) {
        this.logger.warn('WhatsApp credentials not configured. Message not sent.');
        this.logger.log(`Message content: ${message}`);
        return;
      }

      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          From: this.fromNumber,
          To: this.adminNumber,
          Body: message,
        }),
        {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log(`WhatsApp message sent successfully: ${response.data.sid}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send WhatsApp message: ${errorMessage}`);
      // Don't throw error to prevent blocking the main flow
    }
  }

  async sendClientMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      if (!this.accountSid || !this.authToken) {
        this.logger.warn('WhatsApp credentials not configured. Message not sent.');
        return;
      }

      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          From: this.fromNumber,
          To: `whatsapp:${phoneNumber}`,
          Body: message,
        }),
        {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log(`WhatsApp message sent to client: ${response.data.sid}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send WhatsApp message to client: ${errorMessage}`);
    }
  }
}