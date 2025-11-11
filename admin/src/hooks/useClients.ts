/**
 * React Query Hooks for Client Management
 * Encapsulates all data fetching and mutation logic with toast notifications
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAllClients,
  getPendingClients,
  getValidatedClients,
  validateClient,
  quickValidateClient,
  getClientById,
} from '@/src/api/clients.api';
import { ValidateClientRequest } from '@/src/types/client.types';

// Query keys for cache management
export const clientKeys = {
  all: ['clients'] as const,
  allClients: (page: number) => [...clientKeys.all, 'all', page] as const,
  pending: () => [...clientKeys.all, 'pending'] as const,
  validated: () => [...clientKeys.all, 'validated'] as const,
  detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all clients with pagination
 */
export const useAllClients = (page: number = 1) => {
  return useQuery({
    queryKey: clientKeys.allClients(page),
    queryFn: () => getAllClients(page, 10),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch pending clients (last 10)
 */
export const usePendingClients = () => {
  return useQuery({
    queryKey: clientKeys.pending(),
    queryFn: getPendingClients,
    staleTime: 1000 * 60, // 1 minute - refresh more often
  });
};

/**
 * Hook to fetch recently validated clients (last 10)
 */
export const useValidatedClients = () => {
  return useQuery({
    queryKey: clientKeys.validated(),
    queryFn: getValidatedClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single client by ID
 */
export const useClientById = (id: string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => getClientById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to validate a client
 * Includes toast notifications and cache invalidation
 */
export const useValidateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data?: ValidateClientRequest;
    }) => validateClient(clientId, data),
    
    onSuccess: (response) => {
      // Show success toast
      toast.success(
        response.message || 'Client validated successfully!',
        {
          duration: 4000,
          icon: '✅',
        }
      );

      // Invalidate and refetch all client queries
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
    
    onError: (error: Error) => {
      // Extract error message
      const errorMessage =
        (error as unknown as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ||
        (error as unknown as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error ||
        'Failed to validate client. Please try again.';

      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      });
    },
  });
};

/**
 * Hook to quickly validate a pending client (direct validation without modal)
 * Includes toast notifications and cache invalidation
 */
export const useQuickValidateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => quickValidateClient(clientId),
    
    onSuccess: (response) => {
      // Show success toast
      toast.success(response.message, {
        duration: 4000,
        icon: '✅',
      });

      // Invalidate and refetch all client queries
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
    
    onError: (error: Error) => {
      // Extract error message
      const errorMessage =
        (error as unknown as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ||
        (error as unknown as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error ||
        'Failed to validate client. Please try again.';

      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      });
    },
    
    // Prevent retry on error
    retry: false,
  });
};
