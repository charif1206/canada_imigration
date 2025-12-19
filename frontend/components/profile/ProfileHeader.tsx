import React from 'react';

interface ProfileHeaderProps {
    onLogout: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">👤 Mon Profil</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Gérez vos informations personnelles</p>
        </div>
        <button
            onClick={onLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg min-h-[44px]"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
        </button>
    </div>
);
