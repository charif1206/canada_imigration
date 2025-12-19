import React from 'react';

export const ResubmissionWarning: React.FC = () => (
    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <p className="text-sm text-yellow-700">
            ℹ️ Votre précédente soumission a été rejetée. Vous pouvez maintenant soumettre à nouveau le formulaire avec les corrections nécessaires.
        </p>
    </div>
);
