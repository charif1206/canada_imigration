/**
 * React Query Hooks for Partners Management
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllPartners, getPartnerById } from '@/src/api/partners.api';

// Query keys for cache management
export const partnerKeys = {
  all: ['partners'] as const,
  allPartners: () => [...partnerKeys.all, 'list'] as const,
  detail: (id: string) => [...partnerKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all partners
 */
export const useAllPartners = () => {
  return useQuery({
    queryKey: partnerKeys.allPartners(),
    queryFn: getAllPartners,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single partner by ID
 */
export const usePartnerById = (id: string) => {
  return useQuery({
    queryKey: partnerKeys.detail(id),
    queryFn: () => getPartnerById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
