/**
 * Client API Functions
 * All API calls related to client management
 */

import api from './axios.config';
import {
  Client,
  ValidateClientRequest,
  ValidateClientResponse,
} from '@/src/types/client.types';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all clients with pagination
 */
export const getAllClients = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Client>> => {
  const response = await api.get<PaginatedResponse<Client>>(`/clients?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Get last 10 pending clients waiting for validation
 */
export const getPendingClients = async (): Promise<Client[]> => {
  const response = await api.get<Client[]>('/admin/clients/pending?limit=10');
  return response.data;
};

/**
 * Get last 10 recently validated clients
 */
export const getValidatedClients = async (): Promise<Client[]> => {
  const response = await api.get<Client[]>('/admin/clients/recent?limit=10');
  return response.data;
};

/**
 * Validate a client
 * @param clientId - The client ID to validate
 * @param data - Optional validation notes
 */
export const validateClient = async (
  clientId: string,
  data?: ValidateClientRequest
): Promise<ValidateClientResponse> => {
  const response = await api.patch<ValidateClientResponse>(
    `/clients/${clientId}/validate`,
    data || {}
  );
  return response.data;
};

/**
 * Quick validate a pending client (admin only)
 * @param clientId - The client ID to validate
 */
export const quickValidateClient = async (clientId: string): Promise<{ message: string; client: Client }> => {
  const response = await api.patch<{ message: string; client: Client }>(
    `/admin/clients/${clientId}/validate`
  );
  return response.data;
};

/**
 * Get single client by ID
 */
export const getClientById = async (clientId: string): Promise<Client> => {
  const response = await api.get<Client>(`/clients/${clientId}`);
  return response.data;
};
