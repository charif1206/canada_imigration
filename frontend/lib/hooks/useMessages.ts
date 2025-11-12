// lib/hooks/useMessages.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios';

// Types
interface Message {
  id: string;
  clientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface CreateMessageData {
  clientId: string;
  subject: string;
  content: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

// API Functions
const messagesApi = {
  sendMessage: async (messageData: CreateMessageData) => {
    const { data } = await axiosInstance.post('/clients/messages', messageData);
    return data;
  },

  sendContactEmail: async (contactData: ContactEmailData) => {
    const { data } = await axiosInstance.post('/clients/contact-email', contactData);
    return data;
  },

  getMessages: async (clientId: string): Promise<Message[]> => {
    const { data } = await axiosInstance.get(`/clients/${clientId}/messages`);
    return data;
  },
};

// Hooks
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
    },
  });
};

export const useSendContactEmail = () => {
  return useMutation({
    mutationFn: messagesApi.sendContactEmail,
    onError: (error: any) => {
      console.error('Failed to send contact email:', error);
    },
  });
};

export const useMessages = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ['messages', clientId],
    queryFn: () => messagesApi.getMessages(clientId!),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
