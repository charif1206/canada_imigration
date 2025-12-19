import React from 'react';

type IconVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple';

interface IconCircleProps {
    variant?: IconVariant;
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
    children: React.ReactNode;
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
};

const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};

const variantClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
};

export const IconCircle: React.FC<IconCircleProps> = ({
    variant = 'blue',
    size = 'md',
    animate = false,
    children
}) => {
    return (
        <div className="mb-6">
            <div className={`mx-auto ${sizeClasses[size]} ${variantClasses[variant]} rounded-full flex items-center justify-center ${animate ? 'animate-pulse' : ''}`}>
                <div className={iconSizeClasses[size]}>
                    {children}
                </div>
            </div>
        </div>
    );
};
