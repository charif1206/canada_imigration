import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';

interface ActionButtonProps {
    href?: string;
    onClick?: () => void;
    variant?: ButtonVariant;
    children: React.ReactNode;
    fullWidth?: boolean;
}

const variantClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
};

export const ActionButton: React.FC<ActionButtonProps> = ({
    href,
    onClick,
    variant = 'blue',
    children,
    fullWidth = true
}) => {
    const className = `${fullWidth ? 'w-full' : ''} ${variantClasses[variant]} ${variant === 'gray' ? '' : 'text-white'} py-3 px-4 rounded-lg font-semibold transition min-h-[44px] flex items-center justify-center`;

    if (href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
};
