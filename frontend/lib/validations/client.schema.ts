/**
 * Client Validation Schemas
 * 
 * Zod schemas that mirror backend DTOs for type-safe validation.
 * These schemas are used with React Hook Form's zodResolver.
 * 
 * @see backend/src/modules/clients/dto/*.dto.ts
 */

import { z } from 'zod';

// ============================================================================
// CLIENT REGISTRATION SCHEMA (Public - Self Registration)
// ============================================================================

export const clientRegisterSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required. Please provide your full name.')
    .max(100, 'Name must not exceed 100 characters.'),
  
  email: z
    .string()
    .min(1, 'Email is required. Please provide a valid email address.')
    .email('Invalid email format. Please provide a valid email address (e.g., user@example.com).'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long. Please choose a stronger password.')
    .max(100, 'Password must not exceed 100 characters.'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match. Please ensure both passwords are identical.',
  path: ['confirmPassword'],
});

export type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;

// ============================================================================
// CLIENT LOGIN SCHEMA (Public - Authentication)
// ============================================================================

export const clientLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required. Please provide your email address.')
    .email('Invalid email format. Please provide a valid email address (e.g., user@example.com).'),
  
  password: z
    .string()
    .min(1, 'Password is required. Please provide your password.'),
});

export type ClientLoginFormData = z.infer<typeof clientLoginSchema>;

// ============================================================================
// CREATE CLIENT SCHEMA (Admin - Create Client Without Password)
// ============================================================================

export const createClientSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required. Please provide the client\'s full name.')
    .max(100, 'Name must not exceed 100 characters.'),
  
  email: z
    .string()
    .min(1, 'Email is required. Please provide the client\'s email address.')
    .email('Invalid email format. Please provide a valid email address (e.g., client@example.com).'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required. Please provide the client\'s phone number.')
    .max(20, 'Phone number must not exceed 20 characters.'),
  
  passportNumber: z
    .string()
    .max(50, 'Passport number must not exceed 50 characters.')
    .optional()
    .or(z.literal('')),
  
  nationality: z
    .string()
    .max(100, 'Nationality must not exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format (e.g., 1990-01-15).')
    .optional()
    .or(z.literal('')),
  
  address: z
    .string()
    .max(500, 'Address must not exceed 500 characters.')
    .optional()
    .or(z.literal('')),
  
  immigrationType: z
    .string()
    .max(100, 'Immigration type must not exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters.')
    .optional()
    .or(z.literal('')),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;

// ============================================================================
// VALIDATE CLIENT SCHEMA (Admin - Approve/Reject Client)
// ============================================================================

export const validateClientSchema = z.object({
  isValidated: z
    .boolean({
      required_error: 'Validation status is required.',
      invalid_type_error: 'Validation status must be true or false.',
    })
    .refine((val) => typeof val === 'boolean', {
      message: 'Validation status must be true or false. Please specify whether the client is validated.',
    }),
  
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters.')
    .optional()
    .or(z.literal('')),
});

export type ValidateClientFormData = z.infer<typeof validateClientSchema>;

// ============================================================================
// HELPER SCHEMAS (Reusable Parts)
// ============================================================================

/**
 * Email validation schema (reusable)
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required.')
  .email('Invalid email format.');

/**
 * Password validation schema (reusable)
 */
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long.')
  .max(100, 'Password must not exceed 100 characters.');

/**
 * Phone validation schema (reusable)
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required.')
  .max(20, 'Phone number must not exceed 20 characters.');
