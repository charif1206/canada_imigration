import React from 'react';

interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
    <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            {title}
        </h3>
        <div className="space-y-4 sm:space-y-6">
            {children}
        </div>
    </div>
);
