/**
 * Auth Module DTOs and Interfaces
 * Centralized exports for all auth-related data transfer objects and types
 */

// DTOs
export { LoginDto } from './login.dto';
export { RegisterAdminDto } from './register-admin.dto';

// Interfaces
export {
  SafeAdmin,
  JwtPayload,
  LoginResponse,
  AdminProfileResponse,
  MessageResponse,
  EmailVerificationResponse,
  TokenGenerationResult,
  PasswordValidationResult,
} from '../interfaces/auth.interface';

// Constants
export {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOG_MESSAGES,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_ROLE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_SALT_ROUNDS,
  EMAIL_VERIFICATION_TOKEN_LENGTH,
  EMAIL_VERIFICATION_EXPIRY_HOURS,
  PASSWORD_RESET_TOKEN_LENGTH,
  PASSWORD_RESET_EXPIRY_HOURS,
} from '../constants/auth.constants';
