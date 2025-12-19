import * as crypto from 'crypto';
import {
  EMAIL_VERIFICATION_TOKEN_LENGTH,
  EMAIL_VERIFICATION_EXPIRY_HOURS,
  PASSWORD_RESET_TOKEN_LENGTH,
  PASSWORD_RESET_EXPIRY_HOURS,
} from '../constants/auth.constants';
import { TokenGenerationResult } from '../interfaces/auth.interface';

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate email verification token with expiry
 */
export function generateEmailVerificationToken(): TokenGenerationResult {
  const token = generateToken(EMAIL_VERIFICATION_TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  return { token, expiresAt };
}

/**
 * Generate password reset token with expiry
 */
export function generatePasswordResetToken(): TokenGenerationResult {
  const token = generateToken(PASSWORD_RESET_TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  return { token, expiresAt };
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return expiryDate < new Date();
}
