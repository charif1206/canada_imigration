import { Injectable, UnauthorizedException, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    // Create default admin if not exists
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      const username = this.configService.get<string>('ADMIN_DEFAULT_USERNAME') || 'admin';
      
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { username },
      });

      if (!existingAdmin) {
        const password = this.configService.get<string>('ADMIN_DEFAULT_PASSWORD') || 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            email: 'admin@immigration.com',
            role: 'admin',
          },
        });

        this.logger.log(`✅ Default admin created: ${username}`);
        this.logger.warn(`⚠️ Please change the default password immediately!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create default admin: ${errorMessage}`);
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new UnauthorizedException(`Admin account with username '${username}' does not exist. Please check your username or contact support.`);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect. Please check your password and try again.');
    }

    const { password: _, ...result } = admin;
    return result;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateUser(loginDto.username, loginDto.password);

    const payload = {
      username: admin.username,
      sub: admin.id,
      role: admin.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin account not found. Your session may have expired. Please log in again.');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect. Please enter your correct current password to change it.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password changed for admin: ${admin.username}`);

    return { message: 'Password changed successfully' };
  }

  async getProfile(adminId: string) {
    return this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async register(registerDto: { username: string; password: string; email: string; role?: string }) {
    // Check if username already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { username: registerDto.username },
    });

    if (existingAdmin) {
      throw new UnauthorizedException(`Username '${registerDto.username}' is already taken. Please choose a different username.`);
    }

    // Check if email already exists
    const existingEmail = await this.prisma.admin.findFirst({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new UnauthorizedException(`Email '${registerDto.email}' is already registered. Please use a different email or try logging in.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new admin
    const newAdmin = await this.prisma.admin.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        email: registerDto.email,
        role: registerDto.role || 'admin',
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isEmailVerified: false,
      },
    });

    this.logger.log(`✅ New admin created: ${newAdmin.username}`);

    // Send verification email
    try {
      await this.notificationsService.sendVerificationEmail(
        newAdmin.email,
        verificationToken,
        'admin',
      );
      this.logger.log(`📧 Verification email sent to ${newAdmin.email}`);
    } catch (error) {
      this.logger.error('Failed to send verification email:', error);
      // Don't throw error - allow registration to complete even if email fails
    }

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword;
  }

  /**
   * Verify admin email with token
   */
  async verifyEmail(token: string) {
    this.logger.log(`Verifying email with token: ${token.substring(0, 10)}...`);

    const admin = await this.prisma.admin.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!admin) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (admin.isEmailVerified) {
      return { message: 'Email already verified', alreadyVerified: true };
    }

    if (admin.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    // Mark email as verified
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    this.logger.log(`✅ Email verified for admin: ${admin.username}`);

    // Send success email
    try {
      await this.notificationsService.sendVerificationSuccessEmail(
        admin.email,
        admin.username,
        'admin',
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
    const admin = await this.prisma.admin.findFirst({
      where: { email },
    });

    if (!admin) {
      throw new BadRequestException('No account found with this email');
    }

    if (admin.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

    this.logger.log(`📧 Verification email resent to ${admin.email}`);

    return { message: 'Verification email sent' };
  }

  /**
   * Request password reset (forgot password)
   */
  async forgotPassword(email: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { email },
    });

    if (!admin) {
      // Don't reveal if email exists (security best practice)
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

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

    this.logger.log(`📧 Password reset email sent to ${admin.email}`);

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!admin) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (admin.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    this.logger.log(`✅ Password reset for admin: ${admin.username}`);

    return { message: 'Password reset successfully' };
  }
}
