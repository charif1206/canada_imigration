import { Admin } from '@prisma/client';

/**
 * Admin without sensitive data
 */
export interface SafeAdmin extends Omit<Admin, 'password' | 'emailVerificationToken' | 'resetPasswordToken'> {}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  username: string;
  sub: string;
  role: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  access_token: string;
  admin: AdminProfileResponse;
}

/**
 * Admin profile response (public data only)
 */
export interface AdminProfileResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Registration response
 */
export interface RegistrationResponse extends Omit<SafeAdmin, 'password'> {}

/**
 * Success message response
 */
export interface MessageResponse {
  message: string;
}

/**
 * Email verification response
 */
export interface EmailVerificationResponse extends MessageResponse {
  alreadyVerified?: boolean;
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Token generation result
 */
export interface TokenGenerationResult {
  token: string;
  expiresAt: Date;
}
