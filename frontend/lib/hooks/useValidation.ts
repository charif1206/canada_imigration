// lib/hooks/useValidation.ts
// TODO: Implement validation status feature when backend API is ready
// This file is currently commented out and not in use

/*
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios';
import { useValidationStore } from '../stores/validationStore';

// Types
interface ValidationStatus {
  clientId: string;
  status: 'pending' | 'approved' | 'rejected';
  isValidated: boolean;
  validatedAt: string | null;
  validatedBy: string | null;
  notes?: string;
}

// API Functions
const validationApi = {
  getValidationStatus: async (clientId: string): Promise<ValidationStatus> => {
    const { data } = await axiosInstance.get(`/clients/${clientId}/validation-status`);
    return data;
  },
};

// Hooks
export const useValidationStatus = (clientId: string | undefined) => {
  const { setValidationStatus, setLoading, setError } = useValidationStore();

  return useQuery({
    queryKey: ['validation-status', clientId],
    queryFn: () => validationApi.getValidationStatus(clientId!),
    enabled: !!clientId,
    refetchInterval: 10000, // Refetch every 10 seconds
    onSuccess: (data) => {
      setValidationStatus(data);
      setLoading(false);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to fetch validation status');
      setLoading(false);
    },
  });
};

export const useValidation = () => {
  const { validationStatus, isLoading, error } = useValidationStore();
  
  return {
    validationStatus,
    isLoading,
    error,
  };
};
*/

// Temporary placeholder export to prevent import errors
export const useValidationStatus = () => ({ data: null, isLoading: false, error: null });
export const useValidation = () => ({ validationStatus: null, isLoading: false, error: null });
