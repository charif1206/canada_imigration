import React from 'react';

export const ValidatedStatusAlert: React.FC = () => (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md">
        <div className="flex items-center">
            <div className="shrink-0">
                <svg 
                    className="h-10 w-10 text-green-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                    />
                </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                    ✅ Partenariat approuvé !
                </h3>
                <p className="mt-2 text-sm text-green-700">
                    Félicitations ! Votre demande de partenariat a été approuvée. Un conseiller vous contactera prochainement pour finaliser les modalités de collaboration.
                </p>
            </div>
        </div>
    </div>
);
