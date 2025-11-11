/**
 * Partners API - Admin Dashboard
 * Handles fetching partner applications
 */

import axiosInstance from './axios.config';

export interface PartnerSubmission {
  id: string;
  type: string;
  data: {
    agencyName: string;
    managerName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    clientCount?: string;
    message?: string;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all partner applications
 */
export const getAllPartners = async (): Promise<PartnerSubmission[]> => {
  const response = await axiosInstance.get('/partners');
  return response.data;
};

/**
 * Fetch a single partner by ID
 */
export const getPartnerById = async (id: string): Promise<PartnerSubmission> => {
  const response = await axiosInstance.get(`/partners/${id}`);
  return response.data;
};
