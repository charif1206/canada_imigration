// lib/axios.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Function to get token from Zustand store (accessed via localStorage)
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  
  return null;
};

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand persisted storage
    const token = getAuthToken();
    
    console.log('🔐 Axios interceptor - Token check:', token ? 'Token exists' : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Authorization header added to request:', config.url);
    } else {
      console.log('⚠️ No token found in auth storage for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear auth storage and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          console.error('Resource not found:', data.message);
          break;
        case 409:
          // Conflict (e.g., duplicate email)
          console.error('Conflict:', data.message);
          break;
        case 500:
          console.error('Server error:', data.message);
          break;
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        error: data.error || 'Error',
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        error: 'NetworkError',
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        error: 'UnknownError',
      });
    }
  }
);

export default axiosInstance;
