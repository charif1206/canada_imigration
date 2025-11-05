// lib/contexts/SocketContext.tsx
// TODO: Implement Socket.IO real-time features when backend WebSocket is ready
// This file is currently commented out and not in use

/*
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useValidationStore } from '../stores/validationStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useAuthStore();
  const { addNotification, setConnected } = useNotificationStore();
  const { updateValidationStatus } = useValidationStore();

  useEffect(() => {
    if (!user || !token) {
      // User not authenticated, don't connect
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnected(false);
      }
      return;
    }

    // Create socket connection
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
      setConnected(true);
      setError(null);
      
      // Join user's personal room
      socketInstance.emit('join', { userId: user.id });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      setConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setError(err.message);
      setIsConnected(false);
      setConnected(false);
    });

    // Validation status updates
    socketInstance.on('validationStatusUpdate', (data: {
      clientId: string;
      status: 'approved' | 'rejected';
      validatedAt: string;
      validatedBy: string;
      notes?: string;
    }) => {
      console.log('📢 Validation status update received:', data);
      
      // Update validation store
      updateValidationStatus({
        status: data.status,
        isValidated: true,
        validatedAt: data.validatedAt,
        validatedBy: data.validatedBy,
        notes: data.notes,
      });

      // Add notification
      addNotification({
        type: 'validation',
        title: data.status === 'approved' ? '✅ Application Approved!' : '❌ Application Rejected',
        message: data.status === 'approved'
          ? 'Congratulations! Your application has been approved by our admin team.'
          : `Your application has been rejected. ${data.notes ? `Reason: ${data.notes}` : 'Please contact us for more information.'}`,
        data,
      });

      // Play notification sound (optional)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(
            data.status === 'approved' ? 'Application Approved' : 'Application Rejected',
            {
              body: data.status === 'approved'
                ? 'Your application has been approved!'
                : 'Your application has been rejected.',
              icon: '/icon.png',
            }
          );
        }
      }
    });

    // General notifications
    socketInstance.on('notification', (data: {
      type: string;
      title: string;
      message: string;
      data?: unknown;
    }) => {
      console.log('📢 Notification received:', data);
      addNotification({
        type: data.type as any,
        title: data.title,
        message: data.message,
        data: data.data,
      });
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user, token]); // Reconnect when user or token changes

  // Request browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
*/

// Temporary placeholder exports to prevent import errors
'use client';

import React, { createContext, useContext } from 'react';

interface SocketContextType {
  socket: null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

// Placeholder provider with no functionality (for now)
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket: null, isConnected: false, error: null }}>
      {children}
    </SocketContext.Provider>
  );
};
