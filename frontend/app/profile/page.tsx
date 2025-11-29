'use client';

import React from 'react';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

const ProfilePage: React.FC = () => {
    const { client, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">👤 Mon Profil</h1>
                        <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {/* Profile Header with Icon */}
                    <div className="bg-linear-to-r from-blue-900 to-red-600 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-16 h-16 text-blue-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="text-white text-center sm:text-left">
                            <h2 className="text-2xl font-bold">{client?.name}</h2>
                            <p className="text-blue-100 mt-1">{client?.email}</p>
                            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                {client?.isValidated ? (
                                    <>
                                        <span className="text-green-300 text-xl">✓</span>
                                        <span className="text-sm font-medium">Profil validé</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-yellow-300 text-xl">⏳</span>
                                        <span className="text-sm font-medium">En attente de validation</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">Informations personnelles</h3>
                                
                                <div className="space-y-6">
                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">{client?.email}</p>
                                    </div>

                                    {/* Phone Number */}
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-600">Numéro de téléphone</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">{client?.phone || 'Non renseigné'}</p>
                                    </div> */}

                                    {/* Country of Residence */}
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-600">Pays de résidence</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">{client?.countryOfResidence || 'Non renseigné'}</p>
                                    </div> */}

                                    {/* Member Since */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Membre depuis</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">
                                            {client?.createdAt && new Date(client.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">Informations d&apos;immigration</h3>
                                
                                <div className="space-y-6">
                                    {/* Passport Number */}
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-600">Numéro de passeport</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">{client?.passportNumber || 'Non renseigné'}</p>
                                    </div> */}

                                    {/* Validation Status */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Statut de validation</label>
                                        <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">
                                            {client?.isValidated ? '✅ Validé' : '⏳ En attente'}
                                        </p>
                                    </div>

                                    {/* Validated At */}
                                    {client?.validatedAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Validé le</label>
                                            <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded">
                                                {new Date(client.validatedAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            
            </div>
        </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;
