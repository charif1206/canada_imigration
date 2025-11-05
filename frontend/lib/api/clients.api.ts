/**
 * Client API Service
 * 
 * Centralized API functions for client operations.
 * All client-related HTTP requests go through this service.
 * Uses Axios with interceptors for authentication and error handling.
 * 
 * @see lib/axios.ts for Axios configuration
 */

import axiosInstance from '../axios';
import type {
  AuthResponse,
  Client,
  ClientListResponse,
  ClientLoginPayload,
  ClientRegisterPayload,
  ClientValidationResponse,
  CreateClientPayload,
  ValidateClientPayload,
} from '../types/client.types';

// ============================================================================
// AUTHENTICATION APIs (Public)
// ============================================================================

/**
 * Register a new client (self-registration with password)
 * 
 * @param payload - Client registration data
 * @returns Auth response with JWT token and client data
 * 
 * @example
 * const response = await registerClient({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'password123',
 *   phone: '+1234567890'
 * });
 */
export const registerClient = async (
  payload: ClientRegisterPayload
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    '/clients/register',
    payload
  );
  return data;
};

/**
 * Login an existing client
 * 
 * @param payload - Login credentials
 * @returns Auth response with JWT token and client data
 * 
 * @example
 * const response = await loginClient({
 *   email: 'john@example.com',
 *   password: 'password123'
 * });
 */
export const loginClient = async (
  payload: ClientLoginPayload
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    '/clients/login',
    payload
  );
  return data;
};

// ============================================================================
// CLIENT MANAGEMENT APIs (Admin)
// ============================================================================

/**
 * Create a new client (admin only, no password required)
 * 
 * @param payload - Client data without password
 * @returns Created client
 * 
 * @example
 * const client = await createClient({
 *   name: 'Jane Smith',
 *   email: 'jane@example.com',
 *   phone: '+1234567890',
 *   passportNumber: 'AB123456',
 *   nationality: 'Canada'
 * });
 */
export const createClient = async (
  payload: CreateClientPayload
): Promise<Client> => {
  const { data } = await axiosInstance.post<Client>('/clients', payload);
  return data;
};

/**
 * Get all clients (admin only)
 * 
 * @returns List of all clients
 * 
 * @example
 * const clients = await getAllClients();
 * console.log(clients); // [{ id: '1', name: 'John Doe', ... }, ...]
 */
export const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axiosInstance.get<Client[]>('/clients');
  return data;
};

/**
 * Get a single client by ID
 * 
 * @param clientId - Client ID
 * @returns Client data
 * 
 * @example
 * const client = await getClientById('123');
 */
export const getClientById = async (clientId: string): Promise<Client> => {
  const { data } = await axiosInstance.get<Client>(`/clients/${clientId}`);
  return data;
};

/**
 * Update a client
 * 
 * @param clientId - Client ID
 * @param payload - Updated client data
 * @returns Updated client
 * 
 * @example
 * const updatedClient = await updateClient('123', {
 *   name: 'John Updated',
 *   phone: '+9876543210'
 * });
 */
export const updateClient = async (
  clientId: string,
  payload: Partial<CreateClientPayload>
): Promise<Client> => {
  const { data } = await axiosInstance.patch<Client>(
    `/clients/${clientId}`,
    payload
  );
  return data;
};

/**
 * Delete a client
 * 
 * @param clientId - Client ID
 * @returns Success message
 * 
 * @example
 * await deleteClient('123');
 */
export const deleteClient = async (clientId: string): Promise<void> => {
  await axiosInstance.delete(`/clients/${clientId}`);
};

// ============================================================================
// CLIENT VALIDATION APIs (Admin)
// ============================================================================

/**
 * Validate or reject a client
 * 
 * @param clientId - Client ID
 * @param payload - Validation status and optional notes
 * @returns Validated client with message
 * 
 * @example
 * // Approve client
 * const result = await validateClient('123', {
 *   isValidated: true,
 *   notes: 'All documents verified'
 * });
 * 
 * // Reject client
 * const result = await validateClient('123', {
 *   isValidated: false,
 *   notes: 'Missing passport documents'
 * });
 */
export const validateClient = async (
  clientId: string,
  payload: ValidateClientPayload
): Promise<ClientValidationResponse> => {
  const { data } = await axiosInstance.patch<ClientValidationResponse>(
    `/clients/${clientId}/validate`,
    payload
  );
  return data;
};

// ============================================================================
// CLIENT PROFILE APIs (Authenticated User)
// ============================================================================

/**
 * Get current authenticated client's profile
 * 
 * @returns Current client data
 * 
 * @example
 * const profile = await getClientProfile();
 * console.log(profile.name); // "John Doe"
 */
export const getClientProfile = async (): Promise<Client> => {
  const { data } = await axiosInstance.get<Client>('/clients/profile');
  return data;
};

/**
 * Update current client's profile
 * 
 * @param payload - Updated profile data
 * @returns Updated client data
 * 
 * @example
 * const updated = await updateClientProfile({
 *   phone: '+9999999999',
 *   address: '123 New Street'
 * });
 */
export const updateClientProfile = async (
  payload: Partial<CreateClientPayload>
): Promise<Client> => {
  const { data } = await axiosInstance.patch<Client>(
    '/clients/profile',
    payload
  );
  return data;
};
