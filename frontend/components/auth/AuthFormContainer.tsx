import React from 'react';

interface AuthFormContainerProps {
    children: React.ReactNode;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
                {children}
            </div>
        </div>
    );
};
