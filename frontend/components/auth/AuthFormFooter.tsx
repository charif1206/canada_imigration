import React from 'react';
import Link from 'next/link';

interface AuthFormFooterProps {
    text: string;
    linkText: string;
    linkHref: string;
}

export const AuthFormFooter: React.FC<AuthFormFooterProps> = ({ text, linkText, linkHref }) => {
    return (
        <div className="mt-6 text-center">
            <p className="text-gray-600">
                {text}{' '}
                <Link href={linkHref} className="text-blue-600 hover:text-blue-700 font-medium">
                    {linkText}
                </Link>
            </p>
        </div>
    );
};
