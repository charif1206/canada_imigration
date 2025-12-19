import { Admin } from '@prisma/client';
import { SafeAdmin, AdminProfileResponse, JwtPayload } from '../interfaces/auth.interface';

/**
 * Remove sensitive data from admin object
 */
export function sanitizeAdmin(admin: Admin): SafeAdmin {
  const {
    password,
    emailVerificationToken,
    resetPasswordToken,
    ...safeAdmin
  } = admin;

  return safeAdmin;
}

/**
 * Transform admin to profile response (public data only)
 */
export function transformToProfileResponse(admin: Admin): AdminProfileResponse {
  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    isEmailVerified: admin.isEmailVerified,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

/**
 * Create JWT payload from admin data
 */
export function createJwtPayload(admin: Admin): JwtPayload {
  return {
    username: admin.username,
    sub: admin.id,
    role: admin.role,
  };
}

/**
 * Format log message with variables
 */
export function formatMessage(template: string, variables: Record<string, string>): string {
  let message = template;
  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(`{${key}}`, value);
  }
  return message;
}
