import axiosInstance from '../axios';

/**
 * Forms API - Frontend
 * Handles form submissions for equivalence, residence, and partner forms
 */

export interface PartnerFormData {
  agencyName: string;
  managerName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  clientCount?: string;
  message?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  formId: string;
  status: string;
}

/**
 * Submit equivalence form (with file upload)
 */
export const submitEquivalenceForm = async (formData: FormData): Promise<FormSubmissionResponse> => {
  const { data } = await axiosInstance.post('/forms/equivalence', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * Submit residence form (with file upload)
 */
export const submitResidenceForm = async (formData: FormData): Promise<FormSubmissionResponse> => {
  const { data } = await axiosInstance.post('/forms/residence', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * Submit partner form (no file upload)
 */
export const submitPartnerForm = async (formData: PartnerFormData): Promise<FormSubmissionResponse> => {
  const { data } = await axiosInstance.post('/forms/partner', formData);
  return data;
};

/**
 * Get all form submissions (admin only)
 */
export const getAllForms = async () => {
  const { data } = await axiosInstance.get('/forms');
  return data;
};

/**
 * Get a specific form by ID (admin only)
 */
export const getFormById = async (id: string) => {
  const { data } = await axiosInstance.get(`/forms/${id}`);
  return data;
};
