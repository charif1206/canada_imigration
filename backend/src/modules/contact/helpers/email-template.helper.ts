import { ContactMessageData } from '../interfaces/contact.interface';
import {
  CONTACT_CONFIG,
  EMAIL_STYLES,
} from '../constants/contact.constants';

/**
 * Generate HTML email template for contact messages
 * @param data - Contact message data
 * @returns HTML string for email
 */
export function generateContactEmailTemplate(
  data: ContactMessageData,
): string {
  const { senderName, senderEmail, subject, message, timestamp } = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: ${EMAIL_STYLES.TEXT_COLOR}; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, ${EMAIL_STYLES.PRIMARY_COLOR} 0%, ${EMAIL_STYLES.SECONDARY_COLOR} 100%); 
            color: ${EMAIL_STYLES.WHITE}; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: ${EMAIL_STYLES.BACKGROUND_COLOR}; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .info-box { 
            background: ${EMAIL_STYLES.WHITE}; 
            border-left: 4px solid ${EMAIL_STYLES.PRIMARY_COLOR}; 
            padding: 15px; 
            margin: 15px 0; 
          }
          .message-box { 
            background: ${EMAIL_STYLES.WHITE}; 
            border: 1px solid ${EMAIL_STYLES.BORDER_COLOR}; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 5px; 
          }
          .label { 
            font-weight: bold; 
            color: ${EMAIL_STYLES.PRIMARY_COLOR}; 
          }
          .reply-tip { 
            margin-top: 20px; 
            padding: 15px; 
            background: ${EMAIL_STYLES.WARNING_BACKGROUND}; 
            border-left: 4px solid ${EMAIL_STYLES.WARNING_COLOR}; 
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            font-size: 12px; 
            color: ${EMAIL_STYLES.GRAY_COLOR}; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>${CONTACT_CONFIG.COMPANY_NAME}</p>
          </div>
          <div class="content">
            <h2>You have received a new message</h2>
            
            <div class="info-box">
              <p><span class="label">From:</span> ${senderName}</p>
              <p><span class="label">Email:</span> ${senderEmail}</p>
              <p><span class="label">Subject:</span> ${subject}</p>
              <p><span class="label">Date:</span> ${timestamp.toLocaleString()}</p>
            </div>

            <h3>Message:</h3>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>

            <div class="reply-tip">
              <strong>💡 Reply Tip:</strong> You can reply directly to ${senderEmail}
            </div>
          </div>
          <div class="footer">
            <p>© ${CONTACT_CONFIG.CURRENT_YEAR} ${CONTACT_CONFIG.COMPANY_NAME}. All rights reserved.</p>
            <p>This email was sent from your website contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
