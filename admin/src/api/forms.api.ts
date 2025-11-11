/**
 * Forms API - Admin Dashboard
 * Handles fetching form submissions
 */

import axiosInstance from './axios.config';

export interface FormSubmission {
  id: string;
  clientId: string;
  type: 'EQUIVALENCE' | 'RESIDENCE';
  data: Record<string, unknown>;
  fileUrl: string | null;
  createdAt: string;
  client?: {
    id: string;
    name: string;
    email: string;
    passportNumber?: string;
    nationality?: string;
    isValidated: boolean;
    validatedAt?: string;
    validatedBy?: string;
    createdAt: string;
  };
}

/**
 * Fetch all form submissions
 */
export const getAllForms = async (): Promise<FormSubmission[]> => {
  const response = await axiosInstance.get('/forms');
  return response.data;
};

/**
 * Fetch a single form by ID
 */
export const getFormById = async (id: string): Promise<FormSubmission> => {
  const response = await axiosInstance.get(`/forms/${id}`);
  return response.data;
};
