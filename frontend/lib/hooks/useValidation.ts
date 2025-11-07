/**
 * Validation Status Hook
 * Fetches and auto-refreshes validation status every 5 minutes
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';

interface ValidationStatus {
  clientId: string;
  name: string;
  isValidated: boolean;
  validatedAt: string | null;
  validatedBy: string | null;
}

// Helper function to get token from Zustand persisted storage
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

async function fetchValidationStatus(clientId: string): Promise<ValidationStatus> {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}/validation-status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch validation status');
  }

  return response.json();
}

export function useValidationStatus() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['validationStatus', user?.id],
    queryFn: () => fetchValidationStatus(user!.id),
    enabled: !!user?.id,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
  });

  // Show notification when validation status changes
  useEffect(() => {
    if (data && user && !user.isValidated && data.isValidated) {
      // User just got validated!
      toast.success(`🎉 Félicitations! Votre profil a été validé par ${data.validatedBy}`, {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Update user in store
      updateUser({
        isValidated: true,
        validatedAt: data.validatedAt,
        validatedBy: data.validatedBy,
      });

      // Play notification sound (optional)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Profil Validé! 🎉', {
            body: `Votre profil a été validé par ${data.validatedBy}`,
            icon: '/favicon.ico',
          });
        }
      }
    }
  }, [data, user, updateUser]);

  return {
    validationStatus: data,
    isLoading,
    error,
    refetch,
  };
}

export const useValidation = () => {
  const { validationStatus, isLoading, error } = useValidationStatus();
  
  return {
    validationStatus,
    isLoading,
    error,
  };
};

