// lib/hooks/useForms.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios';
import { sendEquivalenceToSheets, sendResidenceToSheets } from '../utils/googleSheets';
import { useAuth } from '../useAuth';

// API Functions
const formsApi = {
  submitEquivalenceForm: async (formData: FormData) => {
    const { data } = await axiosInstance.post('/forms/equivalence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  submitResidenceForm: async (formData: FormData) => {
    const { data } = await axiosInstance.post('/forms/residence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

// Hooks
export const useSubmitEquivalenceForm = () => {
  const queryClient = useQueryClient();
  const { client } = useAuth();

  return useMutation({
    mutationFn: formsApi.submitEquivalenceForm,
    onSuccess: async (_data, variables) => {
      // Send to Google Sheets (fire-and-forget)
      if (client?.id) {
        // Extract form data from FormData - Google Sheets needs the actual data
        const entries: Record<string, string | boolean> = {};
        variables.forEach((value, key) => {
          if (key !== 'portfolio') { // Skip file field
            entries[key] = typeof value === 'string' ? value : '';
          }
        });
        await sendEquivalenceToSheets(client.id, entries);
      }
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit equivalence form:', error);
    },
  });
};

export const useSubmitResidenceForm = () => {
  const queryClient = useQueryClient();
  const { client } = useAuth();

  return useMutation({
    mutationFn: formsApi.submitResidenceForm,
    onSuccess: async (_data, variables) => {
      // Send to Google Sheets (fire-and-forget)
      if (client?.id) {
        // Extract form data from FormData - Google Sheets needs the actual data
        const entries: Record<string, string | boolean> = {};
        variables.forEach((value, key) => {
          if (key !== 'fileUpload') { // Skip file field
            entries[key] = typeof value === 'string' ? value : '';
          }
        });
        await sendResidenceToSheets(client.id, entries);
      }
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit residence form:', error);
    },
  });
};
