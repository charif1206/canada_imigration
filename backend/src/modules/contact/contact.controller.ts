import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ContactMessageResponse } from './interfaces/contact.interface';

/**
 * Contact Controller
 * Handles all contact form endpoints
 * 
 * Endpoints:
 * - POST /contact/send-message - Submit contact form message
 */
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // ========================================
  // PUBLIC ENDPOINTS
  // ========================================

  /**
   * Submit contact form message
   * Sends message to admin via email
   * @param sendMessageDto - Contact message data
   * @returns Success response with confirmation message
   */
  @Post('send-message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ContactMessageResponse> {
    return this.contactService.sendContactMessage(sendMessageDto);
  }
}
