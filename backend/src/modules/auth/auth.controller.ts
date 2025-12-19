import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  LoginResponse,
  AdminProfileResponse,
  MessageResponse,
  EmailVerificationResponse,
  SafeAdmin,
} from './interfaces/auth.interface';

/**
 * Authentication Controller
 * Handles all authentication-related HTTP endpoints
 * 
 * Endpoints:
 * - POST /auth/login - User login
 * - POST /auth/register - User registration
 * - GET /auth/profile - Get user profile (protected)
 * - POST /auth/change-password - Change password (protected)
 * - GET /auth/verify-email/:token - Verify email with token
 * - POST /auth/resend-verification - Resend verification email
 * - POST /auth/forgot-password - Request password reset
 * - POST /auth/reset-password/:token - Reset password with token
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========================================
  // PUBLIC ENDPOINTS
  // ========================================

  /**
   * Login endpoint
   * @returns JWT token and admin profile
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Registration endpoint
   * @returns Created admin (without password)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterAdminDto): Promise<SafeAdmin> {
    return this.authService.register(registerDto);
  }

  /**
   * Verify email endpoint
   * @param token - Email verification token from URL
   * @returns Success message
   */
  @Get('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string): Promise<EmailVerificationResponse> {
    return this.authService.verifyEmail(token);
  }

  /**
   * Resend verification email endpoint
   * @param email - Admin email address
   * @returns Success message
   */
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string): Promise<MessageResponse> {
    return this.authService.resendVerificationEmail(email);
  }

  /**
   * Forgot password endpoint
   * @param email - Admin email address
   * @returns Success message
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string): Promise<MessageResponse> {
    return this.authService.forgotPassword(email);
  }

  /**
   * Reset password endpoint
   * @param token - Password reset token from URL
   * @param newPassword - New password
   * @returns Success message
   */
  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return this.authService.resetPassword(token, newPassword);
  }

  // ========================================
  // PROTECTED ENDPOINTS
  // ========================================

  /**
   * Get profile endpoint (requires authentication)
   * @returns Admin profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req): Promise<AdminProfileResponse | null> {
    return this.authService.getProfile(req.user.adminId);
  }

  /**
   * Change password endpoint (requires authentication)
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @returns Success message
   */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return this.authService.changePassword(req.user.adminId, oldPassword, newPassword);
  }
}
