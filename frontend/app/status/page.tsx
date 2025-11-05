'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
// TODO: Implement validation status feature later
// import { useValidationStatus } from '@/lib/hooks/useValidation';
// import { useSocket } from '@/lib/contexts/SocketContext';
// import { useNotificationStore } from '@/lib/stores/notificationStore';
import { useLogout } from '@/lib/hooks/useAuth';

export default function StatusPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  console.log('📊 Status Page - Auth check:', { 
    isAuthenticated, 
    hasUser: !!user,
    userName: user?.name,
    tokenInStorage: typeof window !== 'undefined' ? !!localStorage.getItem('client_token') : 'N/A'
  });
  
  // TODO: Uncomment when validation/notification features are implemented
  // const { isConnected } = useSocket();
  // const { notifications, unreadCount, markAsRead } = useNotificationStore();
  // const { data: validationData, isLoading } = useValidationStatus(user?.id);
  
  const logoutMutation = useLogout();
  
  // FAKE DATA - Replace with real data later
  const isLoading = false;
  const validationData = {
    status: 'pending' as const,
    isValidated: false,
    validatedAt: null,
    validatedBy: null,
    notes: null,
  };

  // No useEffect needed - redirect handled in useAuth hook or use router.replace directly
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.replace('/login');
    }
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return '✅';
    if (status === 'rejected') return '❌';
    return '⏳';
  };

return (
  <div className="min-h-screen bg-slate-50 py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Application Status</h1>
        <button onClick={() => logoutMutation.mutate()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg">Logout</button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          
          {/* TODO: Replace with real validation data when API is ready */}
          <div className="text-center py-8">
            <div className="text-7xl mb-4">{getStatusIcon(validationData.status)}</div>
            <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${getStatusColor(validationData.status)}`}>
              {validationData.status.toUpperCase()}
            </div>
          </div>
          
          {/* TODO: Add notifications section when feature is implemented */}
          {/* <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Notifications ({unreadCount})</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <h4 className="font-semibold">{notif.title}</h4>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div> */}
          
          {/* TODO: Add socket connection status when implemented */}
          {/* <div className="mt-6 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  </div>
);
}
