import {
  Injectable,
  UnauthorizedException,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import {
  LoginResponse,
  AdminProfileResponse,
  MessageResponse,
  EmailVerificationResponse,
  SafeAdmin,
} from './interfaces/auth.interface';
import { hashPassword, comparePasswords } from './helpers/password.helper';
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  isTokenExpired,
} from './helpers/token.helper';
import {
  sanitizeAdmin,
  transformToProfileResponse,
  createJwtPayload,
  formatMessage,
} from './helpers/admin.helper';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOG_MESSAGES,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_ROLE,
} from './constants/auth.constants';

/**
 * Authentication Service
 * Handles authentication, registration, email verification, and password management
 * Follows Single Responsibility Principle with helper functions for specific tasks
 */
@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  // ========================================
  // AUTHENTICATION
  // ========================================

  /**
   * Validate user credentials
   * @throws UnauthorizedException if credentials are invalid
   */
  async validateUser(username: string, password: string): Promise<SafeAdmin> {
    const admin = await this.findAdminByUsername(username);

    if (!admin) {
      throw new UnauthorizedException(
        formatMessage(ERROR_MESSAGES.USERNAME_NOT_FOUND, { username }),
      );
    }

    const isPasswordValid = await comparePasswords(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INCORRECT_PASSWORD);
    }

    return sanitizeAdmin(admin);
  }

  /**
   * Login admin and return JWT token
   * @throws UnauthorizedException if email not verified or credentials invalid
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const admin = await this.validateUser(loginDto.username, loginDto.password);

    if (!admin.isEmailVerified) {
      throw new UnauthorizedException(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const payload = createJwtPayload(admin as Admin);
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      admin: transformToProfileResponse(admin as Admin),
    };
  }

  // ========================================
  // REGISTRATION
  // ========================================

  /**
   * Register a new admin
   * @throws UnauthorizedException if username or email already exists
   */
  async register(registerDto: RegisterAdminDto): Promise<SafeAdmin> {
    // Check for existing username
    await this.checkUsernameAvailability(registerDto.username);

    // Check for existing email
    await this.checkEmailAvailability(registerDto.email);

    // Hash password
    const hashedPassword = await hashPassword(registerDto.password);

    // Generate verification token
    const { token: verificationToken, expiresAt: verificationExpires } =
      generateEmailVerificationToken();

    // Create admin
    const newAdmin = await this.prisma.admin.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        email: registerDto.email,
        role: registerDto.role || DEFAULT_ADMIN_ROLE,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isEmailVerified: false,
      },
    });

    this.logger.log(
      formatMessage(LOG_MESSAGES.NEW_ADMIN_CREATED, { username: newAdmin.username }),
    );

    // Send verification email (non-blocking)
    this.sendVerificationEmailAsync(newAdmin.email, verificationToken);

    return sanitizeAdmin(newAdmin);
  }

  // ========================================
  // EMAIL VERIFICATION
  // ========================================

  /**
   * Verify admin email with token
   * @throws BadRequestException if token is invalid or expired
   */
  async verifyEmail(token: string): Promise<EmailVerificationResponse> {
    this.logger.log(`Verifying email with token: ${token.substring(0, 10)}...`);

    const admin = await this.prisma.admin.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (admin.isEmailVerified) {
      return {
        message: ERROR_MESSAGES.ALREADY_VERIFIED,
        alreadyVerified: true,
      };
    }

    if (isTokenExpired(admin.emailVerificationExpires)) {
      throw new BadRequestException(ERROR_MESSAGES.EXPIRED_TOKEN);
    }

    // Mark as verified
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    this.logger.log(
      formatMessage(LOG_MESSAGES.EMAIL_VERIFIED, { username: admin.username }),
    );

    // Send success email (non-blocking)
    this.sendVerificationSuccessEmailAsync(admin.email, admin.username);

    return { message: SUCCESS_MESSAGES.EMAIL_VERIFIED };
  }

  /**
   * Resend verification email
   * @throws BadRequestException if account not found or already verified
   */
  async resendVerificationEmail(email: string): Promise<MessageResponse> {
    const admin = await this.findAdminByEmail(email);

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    if (admin.isEmailVerified) {
      throw new BadRequestException(ERROR_MESSAGES.ALREADY_VERIFIED);
    }

    // Generate new token
    const { token: verificationToken, expiresAt: verificationExpires } =
      generateEmailVerificationToken();

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send email
    await this.notificationsService.sendVerificationEmail(
      admin.email,
      verificationToken,
      'admin',
    );

    this.logger.log(
      formatMessage(LOG_MESSAGES.VERIFICATION_EMAIL_SENT, { email: admin.email }),
    );

    return { message: SUCCESS_MESSAGES.VERIFICATION_EMAIL_SENT };
  }

  // ========================================
  // PASSWORD MANAGEMENT
  // ========================================

  /**
   * Change password (authenticated user)
   * @throws UnauthorizedException if old password is incorrect
   */
  async changePassword(
    adminId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<MessageResponse> {
    const admin = await this.findAdminById(adminId);

    if (!admin) {
      throw new UnauthorizedException(ERROR_MESSAGES.ADMIN_NOT_FOUND);
    }

    const isPasswordValid = await comparePasswords(oldPassword, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.OLD_PASSWORD_INCORRECT);
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    this.logger.log(
      formatMessage(LOG_MESSAGES.PASSWORD_CHANGED, { username: admin.username }),
    );

    return { message: SUCCESS_MESSAGES.PASSWORD_CHANGED };
  }

  /**
   * Request password reset (forgot password)
   * Returns success message regardless of whether email exists (security)
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const admin = await this.findAdminByEmail(email);

    if (!admin) {
      // Don't reveal if email exists
      return { message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT };
    }

    // Generate reset token
    const { token: resetToken, expiresAt: resetExpires } =
      generatePasswordResetToken();

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Send reset email
    await this.notificationsService.sendPasswordResetEmail(
      admin.email,
      resetToken,
      'admin',
    );

    this.logger.log(
      formatMessage(LOG_MESSAGES.PASSWORD_RESET_REQUESTED, { email: admin.email }),
    );

    return { message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT };
  }

  /**
   * Reset password with token
   * @throws BadRequestException if token is invalid or expired
   */
  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_RESET_TOKEN);
    }

    if (isTokenExpired(admin.resetPasswordExpires)) {
      throw new BadRequestException(ERROR_MESSAGES.EXPIRED_RESET_TOKEN);
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    this.logger.log(
      formatMessage(LOG_MESSAGES.PASSWORD_RESET, { username: admin.username }),
    );

    return { message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS };
  }

  // ========================================
  // PROFILE
  // ========================================

  /**
   * Get admin profile
   */
  async getProfile(adminId: string): Promise<AdminProfileResponse | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Create default admin on module initialization
   */
  private async createDefaultAdmin(): Promise<void> {
    try {
      const username =
        this.configService.get<string>('ADMIN_DEFAULT_USERNAME') || DEFAULT_ADMIN_USERNAME;

      const existingAdmin = await this.findAdminByUsername(username);

      if (!existingAdmin) {
        const password =
          this.configService.get<string>('ADMIN_DEFAULT_PASSWORD') || DEFAULT_ADMIN_PASSWORD;
        const hashedPassword = await hashPassword(password);

        await this.prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            email: DEFAULT_ADMIN_EMAIL,
            role: DEFAULT_ADMIN_ROLE,
            isEmailVerified: true, // Default admin is pre-verified
          },
        });

        this.logger.log(formatMessage(LOG_MESSAGES.DEFAULT_ADMIN_CREATED, { username }));
        this.logger.warn(LOG_MESSAGES.DEFAULT_ADMIN_WARNING);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        formatMessage(ERROR_MESSAGES.DEFAULT_ADMIN_CREATION_FAILED, { error: errorMessage }),
      );
    }
  }

  /**
   * Find admin by username
   */
  private async findAdminByUsername(username: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { username } });
  }

  /**
   * Find admin by email
   */
  private async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findFirst({ where: { email } });
  }

  /**
   * Find admin by ID
   */
  private async findAdminById(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  /**
   * Check if username is available
   * @throws UnauthorizedException if username exists
   */
  private async checkUsernameAvailability(username: string): Promise<void> {
    const existingAdmin = await this.findAdminByUsername(username);

    if (existingAdmin) {
      throw new UnauthorizedException(
        formatMessage(ERROR_MESSAGES.USERNAME_TAKEN, { username }),
      );
    }
  }

  /**
   * Check if email is available
   * @throws UnauthorizedException if email exists
   */
  private async checkEmailAvailability(email: string): Promise<void> {
    const existingEmail = await this.findAdminByEmail(email);

    if (existingEmail) {
      throw new UnauthorizedException(
        formatMessage(ERROR_MESSAGES.EMAIL_TAKEN, { email }),
      );
    }
  }

  /**
   * Send verification email asynchronously (non-blocking)
   */
  private sendVerificationEmailAsync(email: string, token: string): void {
    this.notificationsService
      .sendVerificationEmail(email, token, 'admin')
      .then(() => {
        this.logger.log(formatMessage(LOG_MESSAGES.VERIFICATION_EMAIL_SENT, { email }));
      })
      .catch((error) => {
        this.logger.error(ERROR_MESSAGES.VERIFICATION_EMAIL_FAILED, error);
      });
  }

  /**
   * Send verification success email asynchronously (non-blocking)
   */
  private sendVerificationSuccessEmailAsync(email: string, username: string): void {
    this.notificationsService
      .sendVerificationSuccessEmail(email, username, 'admin')
      .catch((error) => {
        this.logger.error('Failed to send verification success email:', error);
      });
  }
}
