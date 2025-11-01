import { Injectable, NotFoundException, Logger, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ValidateClientDto } from './dto/validate-client.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { SheetsService } from '../sheets/sheets.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
    private readonly sheetsService: SheetsService,
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  async registerClient(registerDto: ClientRegisterDto) {
    this.logger.log(`Registering new client: ${registerDto.email}`);

    // Check if email already exists
    const existingClient = await this.prisma.client.findUnique({
      where: { email: registerDto.email },
    });

    if (existingClient) {
      throw new ConflictException(`Email '${registerDto.email}' is already registered. Please use a different email or try logging in.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create client
    const client = await this.prisma.client.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        phone: registerDto.phone,
        immigrationType: registerDto.immigrationType,
      } as any,
    });

    // Send notifications
    await this.whatsappService.sendMessageToAdmin(
      `🆕 New client registered!\n\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nType: ${client.immigrationType || 'Not specified'}`
    );
    
    await this.sheetsService.sendDataToSheet(client);
    this.notificationsService.notifyClientCreation(client.id);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: client.id,
      email: client.email,
      type: 'client',
    });

    // Remove password from response
    const { password, ...clientData } = client as any;

    return {
      access_token: token,
      client: clientData,
    };
  }

  async loginClient(loginDto: ClientLoginDto) {
    this.logger.log(`Client login attempt: ${loginDto.email}`);

    try {
      // Find client with password using raw query
      this.logger.debug(`Querying database for email: ${loginDto.email}`);
      const client = await this.prisma.$queryRaw`
        SELECT * FROM "Client" WHERE email = ${loginDto.email}
      ` as any[];

      this.logger.debug(`Query result: ${client?.length || 0} client(s) found`);

      if (!client || client.length === 0) {
        this.logger.warn(`Login failed: No client found with email ${loginDto.email}`);
        throw new UnauthorizedException(`No account found with email '${loginDto.email}'. Please check your email or register first.`);
      }

      const clientData = client[0];
      this.logger.debug(`Client found with id: ${clientData.id}`);

      // Verify password
      this.logger.debug(`Verifying password for client: ${clientData.id}`);
      const isPasswordValid = await bcrypt.compare(loginDto.password, clientData.password);

      if (!isPasswordValid) {
        this.logger.warn(`Login failed: Invalid password for email ${loginDto.email}`);
        throw new UnauthorizedException('Password is incorrect. Please check your password and try again.');
      }

      this.logger.debug(`Password verified successfully for client: ${clientData.id}`);

      // Generate JWT token
      this.logger.debug(`Generating JWT token for client: ${clientData.id}`);
      const token = this.jwtService.sign({
        sub: clientData.id,
        email: clientData.email,
        type: 'client',
      });

      this.logger.log(`Client login successful: ${loginDto.email}`);

      // Remove password from response
      const { password, ...responseData } = clientData;

      return {
        access_token: token,
        client: responseData,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Login error for ${loginDto.email}: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getClientProfile(clientId: string) {
    console.log('clientId:', clientId);

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client profile not found. Your session may have expired or the account was deleted. Please log in again.`);
    }

    // Remove password from response
    const { password, ...clientData } = client as any;
    return clientData;
  }

  async createClient(createClientDto: CreateClientDto) {
    this.logger.log(`Creating new client: ${createClientDto.email}`);
    
    // Check if email already exists
    const existingClient = await this.prisma.client.findUnique({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new ConflictException(`Email '${createClientDto.email}' is already registered. Please use a different email or try logging in.`);
    }
    
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
      throw new NotFoundException(`Client with ID '${id}' not found. The client may have been deleted or the ID is incorrect.`);
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