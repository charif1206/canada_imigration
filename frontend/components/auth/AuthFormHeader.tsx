import React from 'react';

interface AuthFormHeaderProps {
    icon: string;
    title: string;
    subtitle: string;
}

export const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ icon, title, subtitle }) => {
    return (
        <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {icon} {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
                {subtitle}
            </p>
        </div>
    );
};
