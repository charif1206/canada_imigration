/**
 * Notification Bell Component
 * Shows validation status notifications - Click to go to status page
 */

'use client';

import { useEffect } from 'react';
import { useValidationStatus } from '@/lib/hooks/useValidation';
import { useAuthStore } from '@/lib/stores/authStore';

export default function NotificationBell() {
  const user = useAuthStore((state) => state.user);
  useValidationStatus(); // Auto-refresh validation status
  
  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Show notification badge if user is not validated
  const hasNotification = user && !user.isValidated;

  return (
    <button
      className="relative p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
      aria-label="Notifications - Voir le statut"
      title="Voir le statut de validation"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      
      {/* Notification Badge */}
      {hasNotification && (
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
}
