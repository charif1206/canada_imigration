/**
 * React Query Hooks for Forms Management
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllForms, getFormById } from '@/src/api/forms.api';

// Query keys for cache management
export const formKeys = {
  all: ['forms'] as const,
  allForms: () => [...formKeys.all, 'list'] as const,
  detail: (id: string) => [...formKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all forms
 */
export const useAllForms = () => {
  return useQuery({
    queryKey: formKeys.allForms(),
    queryFn: getAllForms,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single form by ID
 */
export const useFormById = (id: string) => {
  return useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => getFormById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
