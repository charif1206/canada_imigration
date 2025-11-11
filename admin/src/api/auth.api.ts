/**
 * Auth API Functions
 * All authentication-related API calls
 */

import { api } from './axios.config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  admin: {
    id: string;
    username: string;
    email: string | null;
    role: string;
  };
}

export interface RegisterAdminRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterAdminResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Login admin user
 */
export const loginAdmin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

/**
 * Register new admin user
 */
export const registerAdmin = async (data: RegisterAdminRequest): Promise<RegisterAdminResponse> => {
  const response = await api.post<RegisterAdminResponse>('/auth/register', data);
  return response.data;
};
