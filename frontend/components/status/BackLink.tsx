import React from 'react';
import Link from 'next/link';

interface BackLinkProps {
    href: string;
    text?: string;
}

export const BackLink: React.FC<BackLinkProps> = ({ href, text = 'Back to Login' }) => {
    return (
        <div className="mt-6 text-center">
            <Link
                href={href}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {text}
            </Link>
        </div>
    );
};
