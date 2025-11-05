// lib/hooks/useForms.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios';

// Types
interface EquivalenceFormData {
  prenom: string;
  nom: string;
  adresse: string;
  codePostal: string;
  niveau: string;
  universite: string;
  titreLicence: string;
  titreMaster?: string;
  anneeDebut: string;
  anneeObtentionLicence: string;
  anneeObtentionMaster?: string;
  email: string;
  telephone: string;
  portfolio?: File;
}

interface ResidenceFormData {
  nomComplet: string;
  dateNaissance: string;
  paysResidence: string;
  programme: string;
  numeroDossier: string;
  etape: string;
  fileUpload?: File;
}

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

  return useMutation({
    mutationFn: formsApi.submitEquivalenceForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: any) => {
      console.error('Failed to submit equivalence form:', error);
    },
  });
};

export const useSubmitResidenceForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formsApi.submitResidenceForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error: any) => {
      console.error('Failed to submit residence form:', error);
    },
  });
};
