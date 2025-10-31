import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ValidateClientDto } from './dto/validate-client.dto';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { SheetsService } from '../sheets/sheets.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
    private readonly sheetsService: SheetsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    this.logger.log(`Creating new client: ${createClientDto.email}`);
    
    const client = await this.prisma.client.create({
      data: createClientDto,
    });

    // Send notifications
    await this.whatsappService.sendMessageToAdmin(
      `🆕 New client registered!\n\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nType: ${client.immigrationType || 'Not specified'}`
    );
    
    await this.sheetsService.sendDataToSheet(client);
    this.notificationsService.notifyClientCreation(client.id);

    return client;
  }

  async getAllClients() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async getClientById(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async validateClient(id: string, validateDto: ValidateClientDto) {
    this.logger.log(`Validating client: ${id}`);
    
    const client = await this.prisma.client.update({
      where: { id },
      data: {
        isValidated: validateDto.isValidated,
        validatedAt: validateDto.isValidated ? new Date() : null,
        notes: validateDto.notes,
      },
    });

    // Notify client about validation
    this.notificationsService.notifyClientValidation(id, validateDto.isValidated);
    
    if (validateDto.isValidated) {
      await this.whatsappService.sendClientMessage(
        client.phone,
        `Congratulations ${client.name}! Your immigration application has been validated. We will contact you soon with next steps.`
      );
    }

    return client;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    this.logger.log(`Creating message from client: ${createMessageDto.clientId}`);
    
    const message = await this.prisma.message.create({
      data: createMessageDto,
      include: {
        client: true,
      },
    });

    // Send WhatsApp notification to admin
    await this.whatsappService.sendMessageToAdmin(
      `📩 New message from ${message.client.name}\n\nSubject: ${message.subject}\n\nMessage: ${message.content}\n\nClient Email: ${message.client.email}\nClient Phone: ${message.client.phone}`
    );

    // Send socket notification
    this.notificationsService.notifyNewMessage(message.id, message.clientId);

    return message;
  }

  async getClientMessages(clientId: string) {
    return this.prisma.message.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadMessages() {
    return this.prisma.message.findMany({
      where: { isRead: false },
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async getValidationStatus(clientId: string) {
    const client = await this.getClientById(clientId);
    return {
      clientId: client.id,
      name: client.name,
      isValidated: client.isValidated,
      validatedAt: client.validatedAt,
      notes: client.notes,
    };
  }
}