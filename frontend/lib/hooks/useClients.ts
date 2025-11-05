/**
 * Client React Query Hooks
 * 
 * Custom hooks that wrap React Query mutations and queries.
 * These hooks handle all client operations with automatic loading states,
 * error handling, and success/error toast notifications.
 * 
 * @see lib/api/clients.api.ts for API functions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createClient,
  deleteClient,
  getAllClients,
  getClientById,
  getClientProfile,
  updateClient,
  updateClientProfile,
  validateClient,
} from '../api/clients.api';
import type {
  Client,
  CreateClientPayload,
  ValidateClientPayload,
} from '../types/client.types';

// ============================================================================
// QUERY KEYS (Centralized for cache management)
// ============================================================================

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  profile: () => [...clientKeys.all, 'profile'] as const,
};

// ============================================================================
// CLIENT MANAGEMENT HOOKS (Admin)
// ============================================================================

/**
 * Hook to create a new client (admin only)
 * 
 * @example
 * const CreateClientForm = () => {
 *   const createMutation = useCreateClient();
 * 
 *   const onSubmit = (data) => {
 *     createMutation.mutate(data);
 *   };
 * 
 *   return (
 *     <button disabled={createMutation.isPending}>
 *       {createMutation.isPending ? 'Creating...' : 'Create Client'}
 *     </button>
 *   );
 * };
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      // Invalidate clients list to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      
      // Show success toast
      toast.success(`✅ Client "${data.name}" created successfully!`);
    },
    onError: (error: any) => {
      // Show error toast
      const errorMessage = error?.message || 'Failed to create client. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    },
  });
};

/**
 * Hook to fetch all clients (admin only)
 * 
 * @example
 * const ClientsList = () => {
 *   const { data: clients, isLoading, error } = useGetAllClients();
 * 
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 * 
 *   return (
 *     <ul>
 *       {clients?.map(client => (
 *         <li key={client.id}>{client.name}</li>
 *       ))}
 *     </ul>
 *   );
 * };
 */
export const useGetAllClients = () => {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: getAllClients,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

/**
 * Hook to fetch a single client by ID
 * 
 * @param clientId - Client ID to fetch
 * @param enabled - Whether to enable the query (default: true)
 * 
 * @example
 * const ClientDetail = ({ id }: { id: string }) => {
 *   const { data: client, isLoading } = useGetClientById(id);
 * 
 *   if (isLoading) return <Spinner />;
 *   return <div>{client?.name}</div>;
 * };
 */
export const useGetClientById = (clientId: string, enabled = true) => {
  return useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: () => getClientById(clientId),
    enabled: !!clientId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to update a client
 * 
 * @example
 * const UpdateClientForm = ({ clientId }: { clientId: string }) => {
 *   const updateMutation = useUpdateClient(clientId);
 * 
 *   const onSubmit = (data) => {
 *     updateMutation.mutate(data);
 *   };
 * 
 *   return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
 * };
 */
export const useUpdateClient = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CreateClientPayload>) =>
      updateClient(clientId, payload),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) });
      
      // Show success toast
      toast.success(`✅ Client "${data.name}" updated successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update client. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    },
  });
};

/**
 * Hook to delete a client
 * 
 * @example
 * const DeleteButton = ({ clientId }: { clientId: string }) => {
 *   const deleteMutation = useDeleteClient();
 * 
 *   const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *       deleteMutation.mutate(clientId);
 *     }
 *   };
 * 
 *   return (
 *     <button onClick={handleDelete} disabled={deleteMutation.isPending}>
 *       Delete
 *     </button>
 *   );
 * };
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: (_, deletedClientId) => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      
      // Remove deleted client from cache
      queryClient.removeQueries({ queryKey: clientKeys.detail(deletedClientId) });
      
      // Show success toast
      toast.success('✅ Client deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to delete client. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    },
  });
};

// ============================================================================
// CLIENT VALIDATION HOOKS (Admin)
// ============================================================================

/**
 * Hook to validate or reject a client
 * 
 * @param clientId - Client ID to validate
 * 
 * @example
 * const ValidateClientForm = ({ clientId }: { clientId: string }) => {
 *   const validateMutation = useValidateClient(clientId);
 * 
 *   const handleApprove = () => {
 *     validateMutation.mutate({
 *       isValidated: true,
 *       notes: 'All documents verified'
 *     });
 *   };
 * 
 *   const handleReject = () => {
 *     validateMutation.mutate({
 *       isValidated: false,
 *       notes: 'Missing passport'
 *     });
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleApprove}>Approve</button>
 *       <button onClick={handleReject}>Reject</button>
 *     </div>
 *   );
 * };
 */
export const useValidateClient = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ValidateClientPayload) =>
      validateClient(clientId, payload),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) });
      
      // Show success toast with validation status
      const status = data.client.isValidated ? 'approved' : 'rejected';
      toast.success(`✅ Client ${status} successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to validate client. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    },
  });
};

// ============================================================================
// CLIENT PROFILE HOOKS (Authenticated User)
// ============================================================================

/**
 * Hook to fetch current user's profile
 * 
 * @example
 * const ProfilePage = () => {
 *   const { data: profile, isLoading } = useGetClientProfile();
 * 
 *   if (isLoading) return <Spinner />;
 * 
 *   return (
 *     <div>
 *       <h1>{profile?.name}</h1>
 *       <p>{profile?.email}</p>
 *     </div>
 *   );
 * };
 */
export const useGetClientProfile = () => {
  return useQuery({
    queryKey: clientKeys.profile(),
    queryFn: getClientProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to update current user's profile
 * 
 * @example
 * const UpdateProfileForm = () => {
 *   const updateMutation = useUpdateClientProfile();
 * 
 *   const onSubmit = (data) => {
 *     updateMutation.mutate(data);
 *   };
 * 
 *   return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
 * };
 */
export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientProfile,
    onSuccess: (data) => {
      // Update profile cache
      queryClient.setQueryData<Client>(clientKeys.profile(), data);
      
      // Show success toast
      toast.success('✅ Profile updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update profile. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    },
  });
};
