// lib/hooks/useForms.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitEquivalenceForm, submitResidenceForm, submitPartnerForm, PartnerFormData } from '../api/forms.api';
import { sendEquivalenceToSheets, sendResidenceToSheets, sendPartnerToSheets } from '../utils/googleSheets';
import { useAuth } from '../useAuth';

// API Functions (using imported functions from forms.api.ts)
const formsApi = {
  submitEquivalenceForm,
  submitResidenceForm,
  submitPartnerForm,
};

// Hooks
export const useSubmitEquivalenceForm = () => {
  const queryClient = useQueryClient();
  const { client, refreshAuth } = useAuth();

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
      
      // Refresh auth to get updated status from backend
      setTimeout(() => {
        refreshAuth();
      }, 500);
      
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit equivalence form:', error);
    },
  });
};

export const useSubmitResidenceForm = () => {
  const queryClient = useQueryClient();
  const { client, refreshAuth } = useAuth();

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
      
      // Refresh auth to get updated status from backend
      setTimeout(() => {
        refreshAuth();
      }, 500);
      
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit residence form:', error);
    },
  });
};

export const useSubmitPartnerForm = () => {
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();

  return useMutation({
    mutationFn: formsApi.submitPartnerForm,
    onSuccess: async (_data, variables: PartnerFormData) => {
      // Send to Google Sheets directly from frontend (fire-and-forget)
      await sendPartnerToSheets(variables);
      
      // Refresh auth to get updated partner status from backend
      setTimeout(() => {
        refreshAuth();
      }, 500);
      
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (error: Error) => {
      console.error('Failed to submit partner form:', error);
    },
  });
};
