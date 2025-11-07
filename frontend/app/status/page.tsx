'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useValidationStatus } from '@/lib/hooks/useValidation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StatusPage() {
  const { user } = useAuth();
  const { validationStatus, isLoading, error, refetch } = useValidationStatus();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  
  // Helper to check if token exists in Zustand storage
  const getTokenExists = () => {
    if (typeof window === 'undefined') return 'N/A';
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return !!parsed.state?.token;
      }
      return false;
    } catch {
      return false;
    }
  };
  
  console.log('📊 Status Page - Auth check:', { 
    hasUser: !!user,
    userName: user?.name,
    validationStatus,
    tokenInStorage: getTokenExists()
  });

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">Impossible de charger votre statut de validation.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (isValidated: boolean) => {
    return isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (isValidated: boolean) => {
    return isValidated ? '✅' : '⏳';
  };

  const handleManualRefresh = async () => {
    await refetch();
    setLastChecked(new Date());
  };

  const getTimeSinceLastCheck = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastChecked.getTime()) / 1000);
    
    if (diff < 60) return `Il y a ${diff} seconde${diff !== 1 ? 's' : ''}`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''}`;
    return `Il y a ${Math.floor(diff / 3600)} heure${Math.floor(diff / 3600) !== 1 ? 's' : ''}`;
  };

return (
  <ProtectedRoute>
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">📋 Statut de Validation</h1>
          <p className="text-gray-600">Vérification automatique toutes les 5 minutes</p>
        </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Bienvenue, {user?.name}! 👋</h2>
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>

          <div className="text-xs text-gray-500 mb-6 text-center">
            ⏱️ Dernière vérification: {getTimeSinceLastCheck()}
          </div>
          
          {/* Validation Status */}
          <div className="text-center py-8 border-y border-gray-200 my-6">
            <div className="text-7xl mb-4">{getStatusIcon(validationStatus?.isValidated || false)}</div>
            <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${getStatusColor(validationStatus?.isValidated || false)}`}>
              {validationStatus?.isValidated ? 'VALIDÉ' : 'EN ATTENTE'}
            </div>
            
            {validationStatus?.isValidated && validationStatus.validatedBy && (
              <div className="mt-6 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Validé par:</span> {validationStatus.validatedBy}
                </p>
                {validationStatus.validatedAt && (
                  <p className="text-gray-600 text-sm">
                    {new Date(validationStatus.validatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            )}

            {!validationStatus?.isValidated && (
              <div className="mt-6 text-gray-600">
                <p className="text-sm">Votre profil est en cours de vérification par notre équipe.</p>
                <p className="text-sm mt-2">Vous recevrez une notification dès la validation effectuée.</p>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Informations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Cette page se rafraîchit automatiquement <strong>toutes les 5 minutes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Vous recevrez une <strong>notification</strong> dès que votre profil sera validé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Utilisez le bouton <strong>&quot;Actualiser&quot;</strong> pour vérifier manuellement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>L&apos;icône de notification 🔔 dans la barre de navigation affiche votre statut</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  </ProtectedRoute>
);
}
