/**
 * Auth module configuration constants
 */

// Password requirements
export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_SALT_ROUNDS = 10;

// Token configuration
export const EMAIL_VERIFICATION_TOKEN_LENGTH = 32;
export const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
export const PASSWORD_RESET_TOKEN_LENGTH = 32;
export const PASSWORD_RESET_EXPIRY_HOURS = 1;

// Default admin configuration
export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';
export const DEFAULT_ADMIN_EMAIL = 'admin@immigration.com';
export const DEFAULT_ADMIN_ROLE = 'admin';

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  USERNAME_NOT_FOUND: "Admin account with username '{username}' does not exist. Please check your username or contact support.",
  INCORRECT_PASSWORD: 'Password is incorrect. Please check your password and try again.',
  EMAIL_NOT_VERIFIED: 'Email not verified. Please check your email and verify your account before logging in.',
  
  // Account not found
  ADMIN_NOT_FOUND: 'Admin account not found. Your session may have expired. Please log in again.',
  ACCOUNT_NOT_FOUND: 'No account found with this email',
  
  // Duplicate account errors
  USERNAME_TAKEN: "Username '{username}' is already taken. Please choose a different username.",
  EMAIL_TAKEN: "Email '{email}' is already registered. Please use a different email or try logging in.",
  
  // Password errors
  OLD_PASSWORD_INCORRECT: 'Current password is incorrect. Please enter your correct current password to change it.',
  
  // Token errors
  INVALID_TOKEN: 'Invalid or expired verification token',
  EXPIRED_TOKEN: 'Verification token has expired. Please request a new one.',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  EXPIRED_RESET_TOKEN: 'Reset token has expired. Please request a new one.',
  
  // Verification errors
  ALREADY_VERIFIED: 'Email is already verified',
  
  // General errors
  DEFAULT_ADMIN_CREATION_FAILED: 'Failed to create default admin: {error}',
  VERIFICATION_EMAIL_FAILED: 'Failed to send verification email',
  PASSWORD_RESET_EMAIL_FAILED: 'Failed to send password reset email',
};

// Success messages
export const SUCCESS_MESSAGES = {
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  VERIFICATION_EMAIL_SENT: 'Verification email sent',
  PASSWORD_RESET_EMAIL_SENT: 'If an account exists with this email, a password reset link has been sent.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  ADMIN_CREATED: 'Admin account created successfully',
};

// Log messages
export const LOG_MESSAGES = {
  DEFAULT_ADMIN_CREATED: '✅ Default admin created: {username}',
  DEFAULT_ADMIN_WARNING: '⚠️ Please change the default password immediately!',
  NEW_ADMIN_CREATED: '✅ New admin created: {username}',
  VERIFICATION_EMAIL_SENT: '📧 Verification email sent to {email}',
  EMAIL_VERIFIED: '✅ Email verified for admin: {username}',
  PASSWORD_CHANGED: 'Password changed for admin: {username}',
  PASSWORD_RESET: '✅ Password reset for admin: {username}',
  PASSWORD_RESET_REQUESTED: '📧 Password reset email sent to {email}',
};
