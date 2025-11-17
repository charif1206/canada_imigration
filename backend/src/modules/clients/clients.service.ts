import { Injectable, NotFoundException, Logger, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ValidateClientDto } from './dto/validate-client.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { SendContactEmailDto } from './dto/send-contact-email.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly prisma: PrismaService,
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

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create client
    const client = await this.prisma.client.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isEmailVerified: false,
 // Use phone if provided, otherwise use email as placeholder
      } as any,
    });

    this.logger.log(`✅ New client created: ${client.email}`);

    // Send verification email
    try {
      await this.notificationsService.sendVerificationEmail(
        client.email,
        verificationToken,
        'client',
      );
      this.logger.log(`📧 Verification email sent to ${client.email}`);
    } catch (error) {
      this.logger.error('Failed to send verification email:', error);
      // Don't throw error - allow registration to complete even if email fails
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: client.id,
      email: client.email,
      type: 'client',
    });

    // Remove password and sensitive tokens from response
    const { 
      password, 
      emailVerificationToken, 
      resetPasswordToken,
      ...clientData 
    } = client as any;

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

      // Remove password and sensitive tokens from response
      const { 
        password, 
        emailVerificationToken, 
        resetPasswordToken,
        ...responseData 
      } = clientData;

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

  async getAllClients(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      this.prisma.client.count(),
    ]);

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    
    // Note: isValidated field removed from schema
    // Validation now tracked per form type (equivalenceStatus, residenceStatus, partnerStatus)
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    this.logger.log(`Client ${id} found - validation handled per form type`);

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

    this.logger.log(`Message created: ${message.id} from ${message.client.name}`);

    return message;
  }

  /**
   * Send contact email directly to admin email
   */
  async sendContactEmail(contactEmailDto: SendContactEmailDto) {
    this.logger.log(`Sending contact email from: ${contactEmailDto.email}`);

    const { name, email, message } = contactEmailDto;

    try {
      // Send email to admin
      await this.notificationsService.sendEmail({
        to: 'abedcharif027@gmail.com',
        subject: `Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0A2540; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">
              📧 New Contact Form Submission
            </h2>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #0A2540; margin-bottom: 10px;">Message:</h3>
              <div style="padding: 15px; background-color: #ffffff; border-left: 4px solid #DC2626; border-radius: 4px;">
                <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
              <p>This email was sent from the Canada Immigration contact form.</p>
              <p>Submitted on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      });

      this.logger.log(`Contact email sent successfully from ${email}`);

      return {
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
      };
    } catch (error) {
      this.logger.error(`Failed to send contact email from ${email}:`, error);
      throw new BadRequestException('Failed to send email. Please try again later.');
    }
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
    
    // Return validation status per form type
    return {
      clientId: client.id,
      name: client.name,
      equivalenceStatus: client.equivalenceStatus || 'not_submitted',
      residenceStatus: client.residenceStatus || 'not_submitted',
      partnerStatus: client.partnerStatus || 'not_submitted',
    };
  }

  /**
   * Verify client email with token
   */
  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    this.logger.log(`Verifying client email with token: ${token.substring(0, 10)}...`);

    const client = await this.prisma.client.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!client) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (client.isEmailVerified) {
      return { message: 'Email already verified', alreadyVerified: true };
    }

    if (client.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    // Mark email as verified
    await this.prisma.client.update({
      where: { id: client.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    this.logger.log(`✅ Email verified for client: ${client.email}`);

    // Send success email
    try {
      await this.notificationsService.sendVerificationSuccessEmail(
        client.email,
        client.name,
        'client',
      );
    } catch (error) {
      this.logger.error('Failed to send verification success email:', error);
    }

    return { message: 'Email verified successfully' };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      throw new BadRequestException('No account found with this email');
    }

    if (client.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.client.update({
      where: { id: client.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send email
    await this.notificationsService.sendVerificationEmail(
      client.email,
      verificationToken,
      'client',
    );

    this.logger.log(`📧 Verification email resent to ${client.email}`);

    return { message: 'Verification email sent' };
  }

  /**
   * Request password reset (forgot password)
   */
  async forgotPassword(email: string) {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      // Don't reveal if email exists (security best practice)
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.client.update({
      where: { id: client.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Send reset email
    await this.notificationsService.sendPasswordResetEmail(
      client.email,
      resetToken,
      'client',
    );

    this.logger.log(`📧 Password reset email sent to ${client.email}`);

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    const client = await this.prisma.client.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!client) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (client.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await this.prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    this.logger.log(`✅ Password reset for client: ${client.email}`);

    return { message: 'Password reset successfully' };
  }
}