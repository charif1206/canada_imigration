import React from 'react';

interface InfoFieldProps {
    label: string;
    value: string | null | undefined;
    defaultValue?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({ 
    label, 
    value, 
    defaultValue = 'Non renseigné' 
}) => (
    <div>
        <label className="text-xs sm:text-sm font-medium text-gray-600">{label}</label>
        <p className="text-sm sm:text-base text-gray-800 mt-1 p-2 sm:p-3 bg-gray-50 rounded break-words">
            {value || defaultValue}
        </p>
    </div>
);
