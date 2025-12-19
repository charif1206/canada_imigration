import React from 'react';

export const PendingStatusAlert: React.FC = () => (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md">
        <div className="flex items-center">
            <div className="shrink-0">
                <svg 
                    className="h-10 w-10 text-blue-400 animate-spin" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">
                    ⏳ Demande de partenariat en cours
                </h3>
                <p className="mt-2 text-sm text-blue-700">
                    Votre demande de partenariat est en cours de traitement. Notre équipe vous contactera sous 24 heures pour organiser une réunion de présentation et discuter des tarifs, modalités de collaboration et avantages partenaires.
                </p>
            </div>
        </div>
    </div>
);
