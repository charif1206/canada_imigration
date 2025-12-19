import React from 'react';

interface ValidationBadgeProps {
    isValidated: boolean;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ isValidated }) => (
    <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
        {isValidated ? (
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
);
