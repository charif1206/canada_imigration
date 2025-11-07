/**
 * Protected Route Component
 * Wrapper to protect pages that require authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
