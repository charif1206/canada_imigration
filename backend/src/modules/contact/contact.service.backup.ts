import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly adminEmail = 'abedcharif027@gmail.com';

  constructor(private readonly notificationsService: NotificationsService) {}

  async sendContactMessage(messageDto: SendMessageDto) {
    this.logger.log(
      `Sending contact message from ${messageDto.senderEmail} to admin`,
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; }
            .message-box { background: white; border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 5px; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Message</h1>
              <p>Canada Immigration Services</p>
            </div>
            <div class="content">
              <h2>You have received a new message</h2>
              
              <div class="info-box">
                <p><span class="label">From:</span> ${messageDto.senderName}</p>
                <p><span class="label">Email:</span> ${messageDto.senderEmail}</p>
                <p><span class="label">Subject:</span> ${messageDto.subject}</p>
                <p><span class="label">Date:</span> ${new Date().toLocaleString()}</p>
              </div>

              <h3>Message:</h3>
              <div class="message-box">
                ${messageDto.message.replace(/\n/g, '<br>')}
              </div>

              <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
                <strong>💡 Reply Tip:</strong> You can reply directly to ${messageDto.senderEmail}
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Canada Immigration Services. All rights reserved.</p>
              <p>This email was sent from your website contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.notificationsService.sendEmail({
        to: this.adminEmail,
        replyTo: messageDto.senderEmail,
        subject: `[Contact Form] ${messageDto.subject}`,
        html: htmlContent,
      });

      this.logger.log(
        `✅ Contact message sent successfully from ${messageDto.senderEmail}`,
      );

      return {
        success: true,
        message:
          'Your message has been sent successfully. We will get back to you soon!',
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to send contact message from ${messageDto.senderEmail}:`,
        error,
      );
      throw error;
    }
  }
}
