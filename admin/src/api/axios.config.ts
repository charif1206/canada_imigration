/**
 * Axios Configuration
 * Base configuration with interceptors for global error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUtils } from '../../lib/auth';
import toast from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authUtils.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      authUtils.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      toast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }

    // Handle authorization errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
