import React from 'react';

interface StatusPageContainerProps {
    children: React.ReactNode;
    gradientFrom?: string;
    gradientTo?: string;
}

export const StatusPageContainer: React.FC<StatusPageContainerProps> = ({
    children,
    gradientFrom = 'blue-600',
    gradientTo = 'purple-600'
}) => {
    return (
        <div className={`min-h-screen flex items-center justify-center bg-linear-to-br from-${gradientFrom} to-${gradientTo} py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
                {children}
            </div>
        </div>
    );
};
