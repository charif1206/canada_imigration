'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProfileHeader, ProfileInfoCard } from '@/components/profile';

const ProfilePage: React.FC = () => {
    const { client, logout, refreshAuth } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh profile data when page loads
    useEffect(() => {
        const autoRefresh = async () => {
            if (refreshAuth) {
                await refreshAuth();
            }
        };
        autoRefresh();
    }, [refreshAuth]);

    // Periodic auto-refresh every 30 seconds to sync with admin changes
    useEffect(() => {
        const interval = setInterval(async () => {
            if (refreshAuth && !isRefreshing) {
                await refreshAuth();
                console.log('✅ Auto-refreshed profile data');
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [refreshAuth, isRefreshing]);

    // Manual refresh handler
    const handleRefresh = async () => {
        if (!refreshAuth) return;
        setIsRefreshing(true);
        try {
            await refreshAuth();
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!client) return null;

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    <ProfileHeader onLogout={logout} />
                    <ProfileInfoCard
                        name={client.name}
                        email={client.email}
                        isValidated={client.isValidated}
                        createdAt={client.createdAt}
                        validatedAt={client.validatedAt}
                    />

                    {/* Service Validations Status */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Service Validations
                            </h3>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg 
                                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                    />
                                </svg>
                                {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {/* Partner Application */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-800">🤝 Partner Application</p>
                                    <p className="text-xs text-gray-500 mt-1">Partner Program Service</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    (client as any).partnerStatus === 'validated' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (client as any).partnerStatus === 'rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : (client as any).partnerStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {(client as any).partnerStatus === 'validated' ? '✅ Validated' : 
                                     (client as any).partnerStatus === 'rejected' ? '❌ Rejected' : 
                                     (client as any).partnerStatus === 'pending' ? '⏳ Pending' : '⭕ Not Requested'}
                                </span>
                            </div>

                            {/* Equivalence Application */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-800">🎓 Équivalence de diplôme</p>
                                    <p className="text-xs text-gray-500 mt-1">Diploma Equivalence Service</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    (client as any).equivalenceStatus === 'validated' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (client as any).equivalenceStatus === 'rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : (client as any).equivalenceStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {(client as any).equivalenceStatus === 'validated' ? '✅ Validated' : 
                                     (client as any).equivalenceStatus === 'rejected' ? '❌ Rejected' : 
                                     (client as any).equivalenceStatus === 'pending' ? '⏳ Pending' : '⭕ Not Requested'}
                                </span>
                            </div>

                            {/* Profile Evaluation */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-800">🔍 Évaluation de profil</p>
                                    <p className="text-xs text-gray-500 mt-1">Profile Evaluation Service</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    (client as any).profileEvaluationStatus === 'validated' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (client as any).profileEvaluationStatus === 'rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : (client as any).profileEvaluationStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {(client as any).profileEvaluationStatus === 'validated' ? '✅ Validated' : 
                                     (client as any).profileEvaluationStatus === 'rejected' ? '❌ Rejected' : 
                                     (client as any).profileEvaluationStatus === 'pending' ? '⏳ Pending' : '⭕ Not Requested'}
                                </span>
                            </div>

                            {/* TCF Preparation */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-800">📚 Préparation TCF Canada</p>
                                    <p className="text-xs text-gray-500 mt-1">TCF Canada Preparation Service</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    (client as any).tcfPreparationStatus === 'validated' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (client as any).tcfPreparationStatus === 'rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : (client as any).tcfPreparationStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {(client as any).tcfPreparationStatus === 'validated' ? '✅ Validated' : 
                                     (client as any).tcfPreparationStatus === 'rejected' ? '❌ Rejected' : 
                                     (client as any).tcfPreparationStatus === 'pending' ? '⏳ Pending' : '⭕ Not Requested'}
                                </span>
                            </div>

                            {/* Residence Application */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-800">🏠 Résidence Permanente</p>
                                    <p className="text-xs text-gray-500 mt-1">Permanent Residence Service</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    (client as any).residenceStatus === 'validated' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (client as any).residenceStatus === 'rejected' 
                                        ? 'bg-red-100 text-red-800' 
                                        : (client as any).residenceStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {(client as any).residenceStatus === 'validated' ? '✅ Validated' : 
                                     (client as any).residenceStatus === 'rejected' ? '❌ Rejected' : 
                                     (client as any).residenceStatus === 'pending' ? '⏳ Pending' : '⭕ Not Requested'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
