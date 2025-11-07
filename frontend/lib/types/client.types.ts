/**
 * Client Types
 * 
 * TypeScript types for client-related data structures.
 * These types ensure type safety across the application.
 */

// ============================================================================
// CLIENT ENTITY (Database Model)
// ============================================================================

export interface Client {
  id: string;
  name: string;
  email: string;
  passportNumber?: string | null;
  nationality?: string | null;
  isValidated: boolean;
  validatedAt?: string | null;
  validatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API REQUEST PAYLOADS
// ============================================================================

/**
 * Client registration payload (self-registration with password)
 */
export interface ClientRegisterPayload {
  name: string;
  email: string;
  password: string;

}

/**
 * Client login payload
 */
export interface ClientLoginPayload {
  email: string;
  password: string;
}

/**
 * Create client payload (admin creates without password)
 */
export interface CreateClientPayload {
  name: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  address?: string;
  immigrationType?: string;
  notes?: string;
}

/**
 * Validate client payload (admin approves/rejects)
 */
export interface ValidateClientPayload {
  isValidated: boolean;
  notes?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Authentication response (login/register)
 */
export interface AuthResponse {
  access_token: string;
  client: Client;
}

/**
 * Client list response
 */
export interface ClientListResponse {
  clients: Client[];
  total: number;
}

/**
 * Client validation response
 */
export interface ClientValidationResponse {
  client: Client;
  message: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * API error response structure
 */
export interface ApiError {
  status: number;
  message: string;
  error: string;
  details?: Record<string, string[]>;
}

/**
 * Form error type (for React Hook Form)
 */
export interface FormError {
  field: string;
  message: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial client for updates
 */
export type PartialClient = Partial<Client>;

/**
 * Client without sensitive data (for display)
 */
export type ClientPublic = Omit<Client, 'password'>;

/**
 * Client validation status enum
 */
export enum ClientValidationStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
}
