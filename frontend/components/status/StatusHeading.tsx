import React from 'react';

interface StatusHeadingProps {
    emoji?: string;
    title: string;
    subtitle?: string | React.ReactNode;
}

export const StatusHeading: React.FC<StatusHeadingProps> = ({ emoji, title, subtitle }) => {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {emoji && `${emoji} `}{title}
            </h1>
            {subtitle && (
                <p className="text-gray-600 mb-6">
                    {subtitle}
                </p>
            )}
        </div>
    );
};
